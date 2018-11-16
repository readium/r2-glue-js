import { Caller } from '@teadium/glue-rpc/lib/caller';
import { IAddKeyListenerOptions } from './interface';
export declare class KeyHandling extends Caller {
    constructor(targetWindow: Window);
    addKeyEventListener(target: string, eventType: string, keyCode: string, listener: EventListener, options?: IAddKeyListenerOptions): void;
}
