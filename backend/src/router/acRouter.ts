import express from 'express';
import { acController } from '../controller/acController';

let acRouter = express.Router();

acRouter.get('/status', acController.statusController);

export { acRouter };