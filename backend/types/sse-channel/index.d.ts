declare module "sse-channel" {
  import { IncomingMessage, ServerResponse } from "http";

  export interface SseChannelOptions {
    history?: any[];
    historySize?: number;
    retryTimeout?: number;
    pingInterval?: number;
    jsonEncode?: boolean;
  }

  export interface Message {
    data?: string;
    id?: number;
    event?: string;
    retry?: string;
  }

  type Callback = (err?: Error) => void;

  class SseChannel {
    constructor(options?: SseChannelOptions);

    addClient: (
      request: IncomingMessage,
      response: ServerResponse,
      callback?: Callback,
    ) => void;
    removeClient: (response: ServerResponse) => void;
    getConnectionCount: () => number;
    ping: () => void;
    retry: (duration: number) => void;
    send: (msg: Message | string, clients?: ServerResponse[]) => void;
    close: () => void;
  }

  export = SseChannel;
}
