import {prisma} from "../prisma";

async function findAvailableRooms(checkInDate: Date, checkOutDate: Date) {
	const availableRooms = await prisma.room.findMany({
		where: {
			NOT: {
				Reservations: {
					some: {
						OR: [
							{
								startDate: {
									lt: checkOutDate,
								},
								endDate: {
									gte: checkInDate,
								},
							},
						],
					},
				},
			},
		},
	});

	return availableRooms;
}

async function findBusyDays(startDate: Date, endDate: Date) {
	var busyDays = [];
	var currentDate = new Date(startDate);
	while (currentDate <= endDate) {
		const availableRooms = await findAvailableRooms(
			currentDate,
			currentDate
		);
		if (availableRooms.length === 0) {
			busyDays.push(currentDate);
		}
		currentDate.setDate(currentDate.getDate() + 1);
	}

	return busyDays;
}

const roomService = {
	findAvailableRooms,
	findBusyDays,
};

export {roomService};
