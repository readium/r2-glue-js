export declare type MessageCallback = (...params: any[]) => void;
export declare type MessageResponders = {
    [key: string]: (callback: MessageCallback, ...params: any[]) => Promise<any>;
};
export declare abstract class MessageHandler {
    abstract declarations: MessageResponders;
}
