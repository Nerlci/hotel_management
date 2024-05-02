import { Request, Response } from 'express';
import { acUpdateRequest, responseBase } from 'shared';
import { schedulerService } from '../service/schedulerService';
import { statusService } from '../service/statusService';
import { acService } from '../service/acService';

const updateAC = async (req: Request, res: Response) => {
    // TODO: Call service to check if the user has permission to update the AC
    const ac = acUpdateRequest.parse({
        userId: res.locals.user.userId,
        ...req.body,
    });

    schedulerService.addUpdateRequest(ac);

    const response = responseBase.parse({
        code: '200',
        error: {
            msg: '',
        },
        payload: {},
    });

    res.json(response);
}

const statusAC = async (req: Request, res: Response) => {
    const roomId = req.query.roomId;

    if (typeof roomId !== 'string' && roomId !== undefined) {
        const response = responseBase.parse({
            code: '400',
            error: {
                msg: 'Invalid room ID',
            },
            payload: {},
        });
        res.json(response);
        return;
    }

    if (roomId === undefined) {
        if (res.locals.user.type !== 0) {
            const response = responseBase.parse({
                code: '400',
                error: {
                    msg: 'Permission denied',
                },
                payload: {},
            });
            res.json(response);
            return;
        }
    }

    statusService.listenStatus(req, res, roomId);
};

const detailAC = async (req: Request, res: Response) => {
    const roomId = req.query.roomId;

    if (typeof roomId !== 'string') {
        const response = responseBase.parse({
            code: '400',
            error: {
                msg: 'Invalid room ID',
            },
            payload: {},
        });
        res.json(response);
        return;
    }

    const details = await acService.getDetailByRoomId(roomId);

    const response = responseBase.parse({
        code: '200',
        error: {
            msg: '',
        },
        payload: {
            roomId: roomId,
            details,
        },
    });
    res.json(response);
}

const acController = { updateAC, statusAC, detailAC };
export { acController };
