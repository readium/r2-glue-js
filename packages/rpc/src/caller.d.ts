import { CallbackFunction } from './messageHandling';
import { Controller } from './controller';
import { Message } from './message';
export declare abstract class Caller extends Controller {
    private readonly _targetWindow;
    private readonly _namespace;
    private readonly _messageCorrelations;
    protected constructor(namespace: string, targetWindow: Window);
    protected sendMessage(key: string, parameters: any[], callback?: CallbackFunction): Promise<any> | void;
    protected processMessage(message: Message): void;
    private _getCorrelations;
}
