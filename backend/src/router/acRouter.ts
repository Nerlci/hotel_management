import express from "express";
import { acController } from "../controller/acController";
import { authUserMiddleware } from "../controller/userController";

let acRouter = express.Router();

acRouter.post("/update", authUserMiddleware, acController.updateAC);

acRouter.get("/status", authUserMiddleware, acController.statusAC);

acRouter.get("/detail", authUserMiddleware, acController.detailAC);

acRouter.get("/temp", authUserMiddleware, acController.tempAC);

acRouter.get("/statement", authUserMiddleware, acController.statementAC);

acRouter.get(
  "/statement-file",
  authUserMiddleware,
  acController.statementFileAC,
);

acRouter.get("/price-rate", authUserMiddleware, acController.getPriceRateAC);

acRouter.put("/price-rate", authUserMiddleware, acController.setPriceRateAC);

acRouter.get(
  "/target-range",
  authUserMiddleware,
  acController.getTargetRangeAC,
);

acRouter.put(
  "/target-range",
  authUserMiddleware,
  acController.setTargetRangeAC,
);

export { acRouter };
