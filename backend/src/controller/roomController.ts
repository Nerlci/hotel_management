import {Request, Response} from "express";
import {acUpdateRequest, responseBase} from "shared";
import {roomService} from "../service/roomService";
import {prisma} from "../prisma";

const bookRoom = async (req: Request, res: Response) => {
	const startDate = new Date(req.body.startDate);
	const endDate = new Date(req.body.endDate);
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

	const room = await roomService.findAvailableRooms(startDate, endDate);
	if (room.length === 0) {
		const response = responseBase.parse({
			error: {
				msg: "No available room",
			},
			code: "400",
			payload: {},
		});

		res.json(response);
		return;
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
		const response = responseBase.parse({
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
	const startDate = new Date(req.query.startDate as string);
	const endDate = new Date(req.query.endDate as string);

	console.log(startDate, endDate);
	console.log("checkDaysAvailability");

	const busyDays = await roomService.findBusyDays(startDate, endDate);

	const response = responseBase.parse({
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
	console.log("cancelOrder");

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
