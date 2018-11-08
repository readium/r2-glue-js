export declare enum MessageType {
    Invoke = "invoke",
    Return = "return",
    Callback = "callback"
}
export interface IMessage {
    readonly protocol?: string;
    readonly version?: string;
    readonly correlationId?: string;
    readonly namespace?: string;
    readonly type?: MessageType;
    readonly key: string;
    readonly value: any;
}
export declare class Message implements IMessage {
    readonly protocol: string;
    readonly version: string;
    readonly correlationId: string;
    readonly namespace: string;
    readonly type: MessageType;
    readonly key: string;
    readonly value: any;
    constructor(namespace: string, type: MessageType, key: string, value: any, correlationId?: string);
    static validate(message: IMessage): boolean;
}
