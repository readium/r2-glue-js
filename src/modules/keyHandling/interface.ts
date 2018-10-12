import { IAddEventListenerOptions } from '../eventHandling/interface';

export enum KeyHandlingMessage {
  AddKeyEventListener = 'ADD_KEY_EVENT_LISTENER',
  RemoveKeyEventListener = 'REMOVE_KEY_EVENT_LISTENER',
}

export type KeyEventType = 'keydown' | 'keypress' | 'keyup';

export interface IAddKeyListenerOptions extends IAddEventListenerOptions {
  once?: boolean;
  useCapture?: boolean;
}
