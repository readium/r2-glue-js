import { MessageHandlingDeclarations } from '@teadium/glue-rpc';
import { EventHandler } from '../eventHandling/handler';
export declare class KeyHandler extends EventHandler {
    handlers: MessageHandlingDeclarations;
    private registeredKeyHandlers;
    constructor();
    private _addKeyEventListener;
}
