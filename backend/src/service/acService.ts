import { prisma } from "../prisma";

const getDetailByRoomId = async (roomId: string) => {
	const ac = await prisma.aCRecord.findMany({
		where: {
			roomId: roomId,
			type: 1,
		},
	});

	return ac;
};

const acService = { getDetailByRoomId };
export { acService };
