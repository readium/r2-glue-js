import { IMessage, MessageType } from './message';
declare global {
    interface Window {
        glueEventMessageRemovers: any;
    }
}
export declare type sendMessage = (type: MessageType, name: string, parameters: any[]) => void;
export declare abstract class Receiver {
    private handler;
    protected constructor(namespace: string);
    destroy(): void;
    protected abstract processMessage(message: IMessage, sendMessage?: sendMessage): void;
}
