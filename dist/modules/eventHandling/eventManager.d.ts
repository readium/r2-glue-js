import { AbstractEventManager } from './abstractEventManager';
import { IAddEventListenerOptions } from './interface';
import { MessageCallback } from '../../lib';
export declare class EventManager extends AbstractEventManager {
    private registeredEventRemovers;
    addEventListener(type: string, callback: MessageCallback, options?: IAddEventListenerOptions, resolvedTargets?: EventTarget[]): number;
    removeEventListener(id: number): void;
}
