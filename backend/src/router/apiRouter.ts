import express from "express";
import { userRouter } from "./userRouter";
import { acRouter } from "./acRouter";

let apiRouter = express.Router();

apiRouter.post("/echo", async (req, res) => {
  res.send(req.body);
});

apiRouter.use("/user", userRouter);

apiRouter.use("/ac", acRouter);

export { apiRouter };