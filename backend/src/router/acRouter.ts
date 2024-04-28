import express from 'express';
import { acController } from '../controller/acController';

let acRouter = express.Router();

acRouter.post('/update', acController.updateAC);

acRouter.get('/status', acController.statusAC);

export { acRouter };