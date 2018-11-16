import { Message } from './message';
import { MessageHandling } from './messageHandling';
import { SendMessageFunction, Controller } from './controller';
export declare class Executor extends Controller {
    private readonly _messageHandlingInstance;
    constructor(namespace: string, messageHandlingType: {
        new (): MessageHandling;
    });
    protected processMessage(message: Message, sendMessage: SendMessageFunction): void;
}
