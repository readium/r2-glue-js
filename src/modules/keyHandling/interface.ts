export enum KeyHandlingMessage {
  AddKeyEventListener = 'ADD_KEY_EVENT_LISTENER',
}

export type KeyEventType = 'keydown' | 'keypress' | 'keyup';

export interface IAddKeyListenerOptions {
  preventDefault?: boolean;
  stopPropagation?: boolean;
  stopImmediatePropagation?: boolean;
  once?: boolean;
}
