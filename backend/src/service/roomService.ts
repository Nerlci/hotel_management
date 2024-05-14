import { User } from "@prisma/client";
import { prisma } from "../prisma";
const totalRooms = parseInt(process.env.TOTAL_ROOMS || "2");

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
  return countConflictingReservations < totalRooms;
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

const initRoom = async () => {
  const rooms = await prisma.room.findMany();
  if (rooms.length === 0) {
    for (let i = 0; i < totalRooms; i++) {
      await prisma.room.create({
        data: {
          roomId: `100${i}`,
        },
      });
    }
  }
};

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
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (user === null) {
    throw new Error("User not found");
  }

  const reservation = await prisma.reservation.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (reservation === null) {
    throw new Error("No reservation");
  }

  if (reservation.roomId !== null) {
    throw new Error("You have already checked in");
  }

  return (
    await getAvailableRooms(reservation.startDate, reservation.endDate)
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
  const reservation = await prisma.reservation.findMany({
    where: {
      userId: userId,
    },
  });

  if (reservation.length === 0) {
    throw new Error("No reservation");
  }

  return reservation;
};

const checkDaysAvailability = async (startDate: Date, endDate: Date) => {
  const busyDays = await findBusyDays(startDate, endDate);
  return {
    unavailableDates: busyDays,
  };
};

const cancelOrder = async (userId: string) => {
  const reservation = await prisma.reservation.findMany({
    where: {
      userId: userId,
    },
  });

  if (reservation.length === 0) {
    throw new Error("No reservation");
  } else if (reservation[0].roomId !== null) {
    throw new Error("You have already checked in");
  } else {
    return await prisma.reservation.delete({
      where: {
        userId: userId,
      },
    });
  }
};

const checkIn = async (userId: string, roomId: string) => {
  const room = await prisma.room.findUnique({
    where: {
      roomId: roomId as string,
    },
  });

  if (room === null) {
    throw new Error("Room not found");
  }

  if (room.status === "occupied") {
    throw new Error("Room is occupied");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (user === null) {
    throw new Error("User not found");
  }

  const reservation = await prisma.reservation.findMany({
    where: {
      userId: userId,
    },
  });

  if (reservation.length === 0) {
    throw new Error("No reservation");
  } else if (reservation[0].roomId !== null) {
    throw new Error("You have already checked in");
  }

  if (await prisma.reservation.findFirst({ where: { roomId: roomId } })) {
    throw new Error("Room is occupied");
  }

  const currentDate = new Date("2024-04-14");
  const result = reservation.map(async (r) => {
    if (r.startDate <= currentDate && r.endDate >= currentDate) {
      await prisma.room.update({
        where: {
          roomId: roomId,
        },
        data: {
          status: "occupied",
        },
      });
      return await prisma.reservation.update({
        where: {
          id: r.id,
        },
        data: {
          roomId: room.id,
        },
      });
    }
  });
  if (result.length === 0) {
    throw new Error("No reservation to check in today");
  } else {
    return result;
  }
};

const checkOut = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (user === null) {
    throw new Error("User not found");
  }

  const reservation = await prisma.reservation.findMany({
    where: {
      userId: userId,
    },
  });

  if (reservation.length === 0) {
    throw new Error("No reservation");
  } else if (reservation[0].roomId === null) {
    throw new Error("You have not checked in");
  }

  const room = await prisma.room.findUnique({
    where: {
      id: reservation[0].roomId,
    },
  });

  if (room === null) {
    throw new Error("Room not found");
  }

  await prisma.room.update({
    where: {
      id: room.id,
    },
    data: {
      status: "available",
    },
  });

  return await prisma.reservation.update({
    where: {
      id: reservation[0].id,
    },
    data: {
      roomId: null,
    },
  });
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
};

export { roomService, initRoom };
