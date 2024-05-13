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

  return rooms;
};

const getRoom = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
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

const roomService = {
  findBusyDays,
  checkRoomAvailability,
  getAvailableRooms,
  getRoom,
};

export { roomService, initRoom };
