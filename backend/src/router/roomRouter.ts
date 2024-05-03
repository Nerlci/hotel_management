import express from "express";
import {roomController} from "../controller/roomController";
import {authUserMiddleware} from "../controller/userController";

let roomRouter = express.Router();

roomRouter.post("/book", authUserMiddleware, roomController.bookRoom);
roomRouter.get("/order", authUserMiddleware, roomController.queryRoom);
roomRouter.delete("/book", authUserMiddleware, roomController.cancelOrder);
roomRouter.get(
	"/availability",
	authUserMiddleware,
	roomController.checkDaysAvailability
);
export {roomRouter};
