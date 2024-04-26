import express from "express";
import { userController } from "../controller/userController";

let userRouter = express.Router();

userRouter.post("/register", userController.registerUser);

userRouter.post("/login", userController.loginUser);

export { userRouter };