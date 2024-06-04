import { User } from "@prisma/client";
import { prisma } from "../prisma";
import { configService } from "./configService";
import { acService } from "./acService";
import { parse } from "json2csv";
import { get } from "http";
import { log } from "console";
import { renderBill } from "../utils/renderPdf";

async function checkRoomAvailability(
  checkInDate: Date,
  checkOutDate: Date,
): Promise<boolean> {
  // 查询与给定日期冲突的预定数
  const countConflictingReservations = await prisma.reservation.count({
    where: {
      startDate: {
        lte: checkOutDate,
      },
      endDate: {
        gte: checkInDate,
      },
    },
  });

  // 如果冲突的预定数小于房间总数，则有空房
  return countConflictingReservations < configService.getConfig().rooms.length;
}

async function findBusyDays(startDate: Date, endDate: Date) {
  var busyDays = [];
  var currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    if (!(await checkRoomAvailability(currentDate, currentDate))) {
      busyDays.push(currentDate.toISOString().split("T")[0]);
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return busyDays;
}

const getAvailableRooms = async (startDate: Date, endDate: Date) => {
  // 查询room的reservation中是否有冲突的预定
  const rooms = await prisma.room.findMany({
    where: {
      NOT: {
        reservations: {
          some: {
            startDate: {
              lte: endDate,
            },
            endDate: {
              gte: startDate,
            },
          },
        },
      },
    },
  });

  if (rooms.length === 0) {
    throw new Error("No available rooms");
  }
  return rooms;
};

const getRoom = async (userId: string) => {
  const user = await findUser(userId);

  const reservation = await findReservationByUserId(userId);

  if (reservation[0].roomId !== null) {
    throw new Error("You have already checked in");
  }

  return (
    await getAvailableRooms(reservation[0].startDate, reservation[0].endDate)
  ).map((room) => room.roomId);
};

const bookRoom = async (userId: string, startDate: Date, endDate: Date) => {
  const reservation = await prisma.reservation.findMany({
    where: {
      userId: userId,
    },
  });

  if (reservation.length > 0) {
    throw new Error("You have already booked a room.");
  }

  if (!(await checkRoomAvailability(startDate, endDate))) {
    throw new Error("No available rooms.");
  }

  return await prisma.reservation.create({
    data: {
      userId: userId,
      startDate: startDate,
      endDate: endDate,
    },
  });
};

const checkOrder = async (userId: string) => {
  return await findReservationByUserId(userId);
};

const checkDaysAvailability = async (startDate: Date, endDate: Date) => {
  const busyDays = await findBusyDays(startDate, endDate);
  return {
    unavailableDates: busyDays,
  };
};

const cancelOrder = async (userId: string) => {
  const reservation = await findReservationByUserId(userId);
  if (reservation[0].roomId !== null) {
    throw new Error("You have already checked in");
  } else {
    return await prisma.reservation.delete({
      where: {
        userId: userId,
      },
    });
  }
};

const findRoom = async (roomId: string) => {
  const room = await prisma.room.findUnique({
    where: { roomId },
  });
  if (!room) throw new Error("Room not found");
  return room;
};

const findUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) throw new Error("User not found");
  return user;
};

const findReservationByUserId = async (userId: string) => {
  const reservation = await prisma.reservation.findMany({
    where: { userId },
  });
  if (reservation.length === 0) throw new Error("No reservation");
  if (reservation.length > 1) throw new Error("You have multiple reservations");
  return reservation;
};

const findReservationByRoomId = async (roomId: string) => {
  const reservation = await prisma.reservation.findFirst({
    where: { roomId },
  });
  return reservation;
};

const findUserRoom = async (userId: string) => {
  const reservation = await findReservationByUserId(userId);
  return reservation[0].roomId;
};

const updateRoomStatus = async (roomId: string, status: string) => {
  return await prisma.room.update({
    where: { id: roomId },
    data: { status },
  });
};

const updateReservation = async (
  reservationId: string,
  roomId: string | null,
) => {
  return await prisma.reservation.update({
    where: { id: reservationId },
    data: { roomId },
  });
};

const checkIn = async (userId: string, roomId: string) => {
  const room = await findRoom(roomId);
  if (
    room.status === "occupied" ||
    (await prisma.reservation.findFirst({ where: { roomId } }))
  ) {
    throw new Error("Room is occupied");
  }

  const user = await findUser(userId);
  const reservation = await findReservationByUserId(userId);
  if (reservation[0].roomId !== null)
    throw new Error("You have already checked in");

  await prisma.reservation.update({
    where: { id: reservation[0].id },
    data: { checkInDate: new Date(), checkOutDate: null },
  });

  await updateRoomStatus(room.id, "occupied");
  return await updateReservation(reservation[0].id, roomId);
};

const checkOut = async (userId: string) => {
  const user = await findUser(userId);

  const reservation = await findReservationByUserId(userId);

  if (reservation[0].roomId === null) {
    throw new Error("You have not checked in");
  }

  const room = await findRoom(reservation[0].roomId);
  await prisma.reservation.update({
    where: { id: reservation[0].id },
    data: { checkOutDate: new Date() },
  });
  // const result = await updateReservation(reservation[0].id, null);
  const result = await prisma.reservation.update({
    where: { id: reservation[0].id },
    data: { checkOutDate: new Date() },
  });
  await updateRoomStatus(room.id, "available");

  return result;
};

const calculateLodgingFee = async (
  roomId: string,
  checkInDate: Date,
  checkOutDate: Date,
) => {
  const days = await acService.getDays(roomId, checkInDate, checkOutDate);

  const price = configService.getRoomPrice(roomId);
  if (!price) throw new Error("Room price not found");

  const roomBill = {
    price,
    quantity: days,
    subtotal: days * price,
  };
  return roomBill;
};

const getBill = async (roomId: string) => {
  const reservation = await prisma.reservation.findFirst({
    where: { roomId },
  });
  if (!reservation) throw new Error("No record found.");
  const checkInDate = reservation.checkInDate;
  const checkOutDate = reservation.checkOutDate;
  if (!checkOutDate || !checkInDate) {
    throw new Error("Illegal check in date or check out date");
  }
  const roomDetail = await calculateLodgingFee(
    roomId,
    checkInDate,
    checkOutDate,
  );
  const roomBill = {
    name: "Lodging Fee",
    ...roomDetail,
  };

  const acDetail = await acService.getInvoice(
    roomId,
    checkInDate,
    checkOutDate,
  );
  const acBill = acDetail.map((item) => ({
    name: `AC Fee (${item.price} per second)`,
    ...item,
  }));
  const bill = [roomBill, ...acBill];
  const result = {
    roomId: roomId,
    checkInDate: checkInDate.toISOString(),
    checkOutDate: checkOutDate.toISOString(),
    acTotalFee: acBill.reduce(
      (total: any, item: { subtotal: any }) => total + item.subtotal,
      0,
    ),
    bill,
  };
  return result;
};

const getBillFile = async (roomId: string) => {
  const { bill, checkInDate, checkOutDate, acTotalFee } = await getBill(roomId);
  const headers = ["消费项目", "单价", "数量", "小计"];
  return await renderBill(headers, bill, roomId, checkInDate, checkOutDate);
};

const getAllRooms = async () => {
  const rooms = await prisma.room.findMany();
  const result = [];

  for (const room of rooms) {
    if (room.status === "occupied") {
      const reservation = await findReservationByRoomId(room.roomId);
      if (reservation) {
        result.push({
          roomId: room.roomId,
          occupied: true,
          start: reservation.startDate.toISOString(),
          end: reservation.endDate.toISOString(),
          userId: reservation.userId,
        });
      }
    } else {
      result.push({
        roomId: room.roomId,
        occupied: false,
        start: null,
        end: null,
        userId: null,
      });
    }
  }
  return result;
};

const roomService = {
  findBusyDays,
  checkRoomAvailability,
  getAvailableRooms,
  getRoom,
  bookRoom,
  checkOrder,
  checkDaysAvailability,
  cancelOrder,
  checkIn,
  checkOut,
  findUserRoom,
  getBill,
  getBillFile,
  getAllRooms,
};

export { roomService };
