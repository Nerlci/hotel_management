import { Request, Response } from 'express';
import { ACStatus } from 'shared';
const SseChannel = require('sse-channel');

const channels = new Map();

const getChannel = (roomId: string) => {
    // TODO: Check if the room is valid
    if (!channels.has(roomId)) {
        channels.set(roomId, new SseChannel());
    }

    return channels.get(roomId);
}

const listenStatus = async (req: Request, res: Response, roomId: string) => {
    const channel = getChannel(roomId);
    channel.addClient(req, res);
}

const updateStatus = async (roomId: string, status: ACStatus) => {
    const channel = getChannel(roomId);
    channel.send(JSON.stringify(status));
}

const statusService = {
    listenStatus: listenStatus,
    updateStatus: updateStatus,
};
export { statusService };