import { MessageHandling, MessageHandlingDeclarations } from '@teadium/glue-rpc';
export declare class EventHandler extends MessageHandling {
    handlers: MessageHandlingDeclarations;
    private registeredEventListenerRemovers;
    private _addEventListener;
    private _removeEventListener;
}
