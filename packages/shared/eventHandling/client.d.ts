import { Caller } from '@teadium/glue-rpc/lib/caller';
import { IAddEventListenerOptions } from './interface';
export declare class EventHandling extends Caller {
    constructor(targetWindow: Window);
    addEventListener(target: string, eventType: string, properties: string[], listener: EventListener, options?: IAddEventListenerOptions): Promise<number>;
    removeEventListener(listenerID: number): void;
}
