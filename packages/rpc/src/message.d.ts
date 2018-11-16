export declare enum MessageType {
    Request = "request",
    Respond = "respond",
    Callback = "callback"
}
export interface Message {
    readonly protocol?: string;
    readonly version?: string;
    readonly correlationId?: string;
    readonly namespace?: string;
    readonly type?: MessageType;
    readonly key: string;
    readonly value: any;
}
