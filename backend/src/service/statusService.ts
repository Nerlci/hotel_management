import { Request, Response } from 'express';
import { ACStatus, acStatus } from 'shared';
import { prisma } from '../prisma';
import SseChannel from 'sse-channel';

const channels: Map<string, SseChannel> = new Map();


const getChannel = (roomId: string) => {
    // TODO: Check if the room is valid
    if (!channels.has(roomId)) {
        channels.set(roomId, new SseChannel());
    }


    return channels.get(roomId)!;
}

const listenStatus = async (req: Request, res: Response, roomId: string) => {
    const channel = getChannel(roomId);
    channel.addClient(req, res);

    const status = await prisma.aCRecord.findFirst({
        where: {
            roomId: roomId,
            type: 1,
        },
        orderBy: {
            timestamp: 'desc',
        },
    });
    
    const statusData = status ? acStatus.parse(status) : acStatus.parse({
        roomId: roomId,
        temp: 25,
        mode: 0,
        fanSpeed: 1,
        on: false,
        timestamp: new Date(),
    });
    channel.send(JSON.stringify(statusData), [res]);

}

const updateStatus = async (status: ACStatus) => {
    const channel = getChannel(status.roomId);
    channel.send(JSON.stringify(status));
}

const statusService = {
    listenStatus: listenStatus,
    updateStatus: updateStatus,
};
export { statusService };