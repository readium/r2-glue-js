import { Message, MessageType } from './message';
export declare type SendMessageFunction = (type: MessageType, name: string, parameters: any[]) => void;
export declare abstract class Controller {
    protected constructor(namespace: string);
    protected abstract processMessage(message: Message, sendMessage: SendMessageFunction): void;
}
