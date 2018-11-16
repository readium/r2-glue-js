export declare enum EventHandlingMessage {
    AddEventListener = "ADD_EVENT_LISTENER",
    RemoveEventListener = "REMOVE_EVENT_LISTENER"
}
export interface IAddEventListenerOptions extends AddEventListenerOptions {
    preventDefault?: boolean;
    stopPropagation?: boolean;
    stopImmediatePropagation?: boolean;
}
