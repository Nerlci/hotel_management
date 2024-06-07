import express from "express";
import { roomController } from "../controller/roomController";
import { authUserMiddleware } from "../controller/userController";

let roomRouter = express.Router();

roomRouter.post("/book", authUserMiddleware, roomController.bookRoom);
roomRouter.get("/order", authUserMiddleware, roomController.checkOrder);
roomRouter.delete("/book", authUserMiddleware, roomController.cancelOrder);
roomRouter.get(
  "/availability",
  authUserMiddleware,
  roomController.checkDaysAvailability,
);
roomRouter.get(
  "/available",
  authUserMiddleware,
  roomController.getAvailableRooms,
);
roomRouter.post("/checkin", authUserMiddleware, roomController.checkIn);

roomRouter.get("/room", authUserMiddleware, roomController.getRoom);

roomRouter.post("/checkout", authUserMiddleware, roomController.checkOut);

roomRouter.get("/bill", authUserMiddleware, roomController.getBill);

roomRouter.get("/bill-file", authUserMiddleware, roomController.getBillFile);

roomRouter.get("/rooms", authUserMiddleware, roomController.getAllRooms);

roomRouter.post("/dining", authUserMiddleware, roomController.orderDining);

export { roomRouter };
