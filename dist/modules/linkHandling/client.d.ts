import { Client } from '../../lib/client';
import { IAddEventListenerOptions } from '../eventHandling/interface';
export declare class LinkHandling extends Client {
    readonly typeName: string;
    constructor(targetWindow: Window);
    addEventListener(target: string, eventType: string, properties: string[], listener: EventListener, options?: IAddEventListenerOptions): Promise<number>;
    removeEventListener(listenerID: number): void;
}
