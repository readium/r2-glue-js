import { IMessage } from './message';
import { MessageHandler } from './messageHandler';
import { sendMessage, Receiver } from './receiver';
export declare class Dispatcher extends Receiver {
    private readonly _handler;
    constructor(namespace: string, handlerType: {
        new (): MessageHandler;
    });
    protected processMessage(message: IMessage, sendMessage: sendMessage): void;
    private _handleRequest;
}
