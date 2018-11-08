import { Client } from '../../lib/client';
import { IAddEventListenerOptions } from '../eventHandling/interface';
export declare class SelectionHandling extends Client {
    typeName: string;
    constructor(targetWindow: Window);
    addEventListener(target: string, listener: EventListener, options?: IAddEventListenerOptions): Promise<number>;
    removeEventListener(listenerID: number): void;
}
