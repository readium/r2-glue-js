import { MessageCallback, MessageHandler, MessageResponders } from '../../lib';
import { IAddEventListenerOptions } from './interface';
export declare class EventHandler extends MessageHandler {
    declarations: MessageResponders;
    private eventManager;
    protected createHandler(callback: MessageCallback, properties: string[], options: IAddEventListenerOptions): EventListener;
    private _addEventListener;
    private _removeEventListener;
}
