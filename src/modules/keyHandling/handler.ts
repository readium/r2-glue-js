import { MessageHandler, MessageResponseCallback, MessageResponders } from '../../lib';
import { KeyHandlingMessage, IAddKeyListenerOptions, KeyEventType } from './interface';

interface IRegisteredKeyHandler {
  eventType: KeyEventType;
  callback: MessageResponseCallback;
  options: IAddKeyListenerOptions;
}

export class KeyHandler extends MessageHandler {
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
      });
    };
    window.addEventListener('keydown', keyboardEventHandler, true);
    window.addEventListener('keypress', keyboardEventHandler, true);
    window.addEventListener('keyup', keyboardEventHandler, true);
  }

  private _addKeyEventListener(
    callback: MessageResponseCallback,
    eventType: KeyEventType,
    keyCode: string,
    options: IAddKeyListenerOptions = {},
  ): void {
    this.registeredKeyHandlers[keyCode].push({
      eventType,
      callback,
      options,
    });
  }
}
