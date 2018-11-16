export declare type CallbackFunction = (...params: any[]) => void;
export declare type MessageHandlingDeclarations = {
    [key: string]: (callback: CallbackFunction, ...params: any[]) => Promise<any>;
};
export declare abstract class MessageHandling {
    abstract handlers: MessageHandlingDeclarations;
}
