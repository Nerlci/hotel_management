import { Request, Response } from 'express';
const SseChannel = require('sse-channel');

const statusController = async (req: Request, res: Response) => {
    const str = 'hello word!';
    let index = 0;

    let channel = new SseChannel();
    channel.addClient(req, res);

    const timer = setInterval(() => {
        if (index < str.length) {
            channel.send(JSON.stringify({ data: str[index] }));
            index++;
        } else {
            clearInterval(timer); // 停止定时器
            channel.close(); // 关闭通道
        }

    }, 100);
};

const acController = { statusController };
export { acController };