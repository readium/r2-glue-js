export enum EventHandlingMessage {
  AddEventListener = 'ADD_EVENT_LISTENER',
  OnEvent = 'ON_EVENT',
}

export interface IAddEventListenerOptions extends AddEventListenerOptions {
  preventDefault?: boolean;
  stopPropagation?: boolean;
  stopImmediatePropagation?: boolean;
}
