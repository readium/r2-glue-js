import { IAddEventListenerOptions } from './interface';
import { MessageCallback } from '../../lib';
interface IRegisteredHandler {
    eventType: any;
    callback: any;
    options?: any;
}
export declare abstract class AbstractEventManager {
    private lastEventID;
    private registeredEventHandlers;
    getEventHandler(eventID: number): IRegisteredHandler;
    generateEventID(): number;
    addEventListener(eventType: string, callback: MessageCallback, options?: IAddEventListenerOptions): number;
    removeEventListener(id: number): void;
}
export {};
