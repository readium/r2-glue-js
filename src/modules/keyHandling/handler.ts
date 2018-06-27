import { MessageHandler, messageResponseCallback } from '../../lib';
import { KeyHandlingMessage, IAddKeyListenerOptions, KeyEventType } from './interface';

interface IRegisteredKeyHandler {
  eventType: string;
  callback: messageResponseCallback;
  options: IAddKeyListenerOptions;
}

export class KeyHandler extends MessageHandler {
  constructor() {
    super();
    const registeredKeyHandlers: { [key: string]: IRegisteredKeyHandler[] } = {};
    const keyboardEventHandler = (event: KeyboardEvent) => {
      if (event.defaultPrevented) {
        // Skip if event is already handled
        return;
      }

      const matchingKeyHandlerSet = registeredKeyHandlers[event.key] || [];
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

  private [KeyHandlingMessage.AddKeyEventListener](
    callback: messageResponseCallback,
    eventType: KeyEventType,
    keyCode: string,
    options: IAddKeyListenerOptions = {},
  ): void {}
}
