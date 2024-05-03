import {Request, Response} from "express";
import {DateRange, responseBase, userAvailablityResponse, userRoomOrderResponse} from "shared";
import {roomService} from "../service/roomService";
import {prisma} from "../prisma";

const bookRoom = async (req: Request, res: Response) => {
	let reqBody: DateRange;
	try {
		reqBody = DateRange.parse(req.body);
	} catch (e: any) {
		const response = responseBase.parse({
			error: {
				msg: e.message,
			},
			code: "400",
			payload: {},
		});
		res.json(response);
		return;
	}
	const startDate = new Date(reqBody.startDate);
	const endDate = new Date(reqBody.endDate);
	const userId = res.locals.user.userId;

	// 一个用户只能订一间房
	const userRoom = await prisma.reservation.findMany({
		where: {
			userId: userId,
		},
	});

	if (userRoom.length > 0) {
		const response = responseBase.parse({
			error: {
				msg: "You have already booked a room",
			},
			code: "400",
			payload: {},
		});

		res.json(response);
		return;
	}

	if (!(await roomService.checkRoomAvailability(startDate, endDate))) {
		const response = responseBase.parse({
			error: {
				msg: "No room available. Please choose another date.",
			},
			code: "400",
			payload: {},
		});

		res.json(response);
	} else {
		await prisma.reservation.create({
			data: {
				userId: userId,
				startDate: startDate,
				endDate: endDate,
			},
		});

		const response = responseBase.parse({
			error: {
				msg: "",
			},
			code: "200",
			payload: {},
		});

		res.json(response);
	}
};

// 订单查询
const queryRoom = async (req: Request, res: Response) => {
	const userId = res.locals.user.userId;
	const room = await prisma.reservation.findMany({
		where: {
			userId: userId,
		},
	});

	if (room.length === 0) {
		const response = userRoomOrderResponse.parse({
			error: {
				msg: "No reservation",
			},
			code: "400",
			payload: {
				roomId: "",
			},
		});

		res.json(response);
		return;
	} else {
		const response = userRoomOrderResponse.parse({
			error: {
				msg: "",
			},
			code: "200",
			payload: {
				roomId: room[0].roomId ? room[0].roomId : "",
			},
		});

		res.json(response);
	}
};

const checkDaysAvailability = async (req: Request, res: Response) => {
	let reqBody: DateRange;
	try {
		reqBody = DateRange.parse(req.query);
	} catch (e: any) {
		console.log(e);
		const response = responseBase.parse({
			error: {
				msg: e.message,
			},
			code: "400",
			payload: {},
		});
		res.json(response);
		return;
	}
	const startDate = new Date(reqBody.startDate);
	const endDate = new Date(reqBody.endDate);

	const busyDays = await roomService.findBusyDays(startDate, endDate);

	const response = userAvailablityResponse.parse({
		error: {
			msg: "",
		},
		code: "200",
		payload: {
			unavailableDates: busyDays,
		},
	});

	res.json(response);
};

// 客房退订
const cancelOrder = async (req: Request, res: Response) => {
	const userId = res.locals.user.userId;

	const room = await prisma.reservation.findMany({
		where: {
			userId: userId,
		},
	});

	if (room.length === 0) {
		const response = responseBase.parse({
			error: {
				msg: "No reservation",
			},
			code: "400",
			payload: {},
		});

		res.json(response);
		return;
	} else {
		await prisma.reservation.delete({
			where: {
				userId: userId,
			},
		});

		const response = responseBase.parse({
			error: {
				msg: "",
			},
			code: "200",
			payload: {},
		});

		res.json(response);
	}
};

const roomController = {
	bookRoom,
	queryRoom,
	checkDaysAvailability,
	cancelOrder,
};

export {roomController};
