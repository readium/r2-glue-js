import { MessageHandler, MessageCallback, MessageResponders } from '../../lib';
import { KeyHandlingMessage, IAddKeyListenerOptions, KeyEventType } from './interface';
import { marshalEvent } from '../../lib/marshaling';
import { EventHandler } from '../eventHandling/handler';

interface IRegisteredKeyHandler {
  eventType: KeyEventType;
  callback: MessageCallback;
  options: IAddKeyListenerOptions;
}

const KEYBOARD_EVENT_PROPERTIES = [
  'key',
  'code',
  'location',
  'ctrlKey',
  'shiftKey',
  'altKey',
  'metaKey',
  'isComposing',
];

export class KeyHandler extends EventHandler {
  declarations: MessageResponders = {
    [KeyHandlingMessage.AddKeyEventListener]: this._addKeyEventListener,
  };

  private registeredKeyHandlers: { [key: string]: IRegisteredKeyHandler[] } = {};

  constructor() {
    super();
    const keyboardEventHandler = (event: KeyboardEvent) => {
      if (event.defaultPrevented) {
        // Skip if event is already handled
        return;
      }

      const matchingKeyHandlerSet = this.registeredKeyHandlers[event.key] || [];
      matchingKeyHandlerSet.forEach((handlerInfo) => {
        if (handlerInfo.eventType !== event.type) {
          return;
        }

        if (handlerInfo.options.preventDefault) {
          event.preventDefault();
        }

        handlerInfo.callback(marshalEvent(event, KEYBOARD_EVENT_PROPERTIES));
      });
    };
    window.addEventListener('keydown', keyboardEventHandler, true);
    window.addEventListener('keypress', keyboardEventHandler, true);
    window.addEventListener('keyup', keyboardEventHandler, true);
  }

  private async _addKeyEventListener(
    callback: MessageCallback,
    target: string,
    eventType: KeyEventType,
    keyCode?: string,
    options?: IAddKeyListenerOptions,
  ): Promise<void> {
    // if (!this.registeredKeyHandlers[keyCode]) {
    //   this.registeredKeyHandlers[keyCode] = [];
    // }
    // this.registeredKeyHandlers[keyCode].push({ eventType, callback, options });
  }
}
