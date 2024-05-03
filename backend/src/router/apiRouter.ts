import express from "express";
import {userRouter} from "./userRouter";
import {acRouter} from "./acRouter";
import {roomRouter} from "./roomRouter";

let apiRouter = express.Router();

apiRouter.post("/echo", async (req, res) => {
	res.send(req.body);
});

apiRouter.use("/user", userRouter);

apiRouter.use("/ac", acRouter);

apiRouter.use("/room", roomRouter);

export {apiRouter};
