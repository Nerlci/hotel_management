import express from "express";
import { acController } from "../controller/acController";
import { authUserMiddleware } from "../controller/userController";

let acRouter = express.Router();

acRouter.post("/update", authUserMiddleware, acController.updateAC);

acRouter.get("/status", authUserMiddleware, acController.statusAC);

acRouter.get("/detail", authUserMiddleware, acController.detailAC);

acRouter.get("/statement", authUserMiddleware, acController.statementAC);

acRouter.get(
  "/statement_table",
  authUserMiddleware,
  acController.statementTableAC,
);

export { acRouter };
