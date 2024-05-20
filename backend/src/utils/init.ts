import { prisma } from "../prisma";
import { configService } from "../service/configService";

const totalRooms = parseInt(process.env.TOTAL_ROOMS || "2");

const initRoom = async () => {
  const rooms = await prisma.room.findMany();
  const roomIdsInDB = new Set(rooms.map((room) => room.roomId));

  const config = configService.getConfig();
  const roomIdsInConfig = new Set(config.rooms.map((room) => room.roomId));

  // 创建在配置中存在但数据库中不存在的房间
  const roomsToCreate = [...roomIdsInConfig].filter(
    (roomId) => !roomIdsInDB.has(roomId),
  );
  for (let roomId of roomsToCreate) {
    await prisma.room.create({
      data: {
        roomId: roomId,
      },
    });
  }

  // 删除在数据库中存在但配置中不存在的房间
  const roomsToDelete = [...roomIdsInDB].filter(
    (roomId) => !roomIdsInConfig.has(roomId),
  );
  for (let roomId of roomsToDelete) {
    await prisma.room.delete({
      where: {
        roomId: roomId,
      },
    });
  }
};

const init = () => {
  configService.loadConfig();
  initRoom();
};

export { init };
