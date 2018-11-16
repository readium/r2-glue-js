import { Message, MessageType } from './message';
export declare class HandledMessage implements Message {
    readonly protocol: string;
    readonly version: string;
    readonly correlationId: string;
    readonly namespace: string;
    readonly type: MessageType;
    readonly key: string;
    readonly value: any;
    constructor(namespace: string, type: MessageType, key: string, value: any, correlationId?: string);
    static validate(message: Message): boolean;
}
