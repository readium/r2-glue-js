import { MessageHandler, MessageResponders } from '../../lib';
export declare class KeyHandler extends MessageHandler {
    declarations: MessageResponders;
    private registeredKeyHandlers;
    private registeredKeyCodes;
    private lastUsedID;
    private eventManager;
    constructor();
    private _createEventHandler;
    private _addEventListener;
    private _removeEventListener;
}
