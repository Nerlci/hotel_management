import express from "express";
import { userRouter } from "./userRouter";
import jwt from "jsonwebtoken";

let apiRouter = express.Router();

apiRouter.post("/echo", async (req, res) => {
  res.send(req.body);
});

apiRouter.use("/user", userRouter);

export { apiRouter };