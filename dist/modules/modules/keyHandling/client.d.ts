import { Client } from '../../lib/client';
import { IAddKeyListenerOptions } from './interface';
export declare class KeyHandling extends Client {
    readonly typeName: string;
    constructor(targetWindow: Window);
    addKeyEventListener(target: string, eventType: string, keyCode: string, listener: EventListener, options?: IAddKeyListenerOptions): Promise<number>;
    removeKeyEventListener(listenerID: number): void;
}
