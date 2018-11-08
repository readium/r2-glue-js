import { MessageCallback } from '../../lib';
import { IAddEventListenerOptions } from '../eventHandling/interface';
import { EventHandler } from '../eventHandling/handler';
export declare class SelectionHandler extends EventHandler {
    protected createHandler(callback: MessageCallback, properties: string[], options: IAddEventListenerOptions): EventListener;
}
