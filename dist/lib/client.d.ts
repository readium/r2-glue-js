import { IMessage } from '../lib';
import { MessageCallback } from './messageHandler';
import { Receiver } from './receiver';
export declare abstract class Client extends Receiver {
    abstract readonly typeName: string;
    private readonly _targetWindow;
    private readonly _namespace;
    private readonly _messageCorrelations;
    protected constructor(namespace: string, targetWindow: Window);
    protected sendMessage(key: string, parameters: any[], callback?: MessageCallback): Promise<any> | void;
    protected processMessage(message: IMessage): void;
    private _getCorrelations;
}
