import { CallbackFunction, CallSource, GlueService } from '@readium/glue-rpc';
import { KeyHandlingMessage, IAddKeyListenerOptions, KeyEventType } from './interface';
import { marshalEvent } from '@readium/glue-rpc/lib/marshaling';

interface IRegisteredKeyHandler {
  eventType: KeyEventType;
  callback: CallbackFunction;
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

export class KeyHandler extends GlueService {
  private readonly registeredKeyHandlers: { [key: string]: IRegisteredKeyHandler[] } = {};
  private readonly registeredAnyKeyHandlers: IRegisteredKeyHandler[] = [];

  constructor(messageSource: CallSource) {
    super(messageSource);

    messageSource.bind(KeyHandlingMessage.AddKeyEventListener, this._addKeyEventListener);

    const keyboardEventHandler = (event: KeyboardEvent) => {
      if (event.defaultPrevented) {
        // Skip if event is already handled
        return;
      }

      const matchingKeyHandlerSet = [
        ...(this.registeredKeyHandlers[event.key] || []),
        ...this.registeredAnyKeyHandlers,
      ];

      matchingKeyHandlerSet.forEach((handlerInfo) => {
        if (handlerInfo.eventType !== event.type) {
          return;
        }

        if (handlerInfo.options.preventDefault) {
          event.preventDefault();
        }

        if (handlerInfo.options.once) {
          matchingKeyHandlerSet.splice(matchingKeyHandlerSet.indexOf(handlerInfo), 1);
        }

        handlerInfo.callback(marshalEvent(event, KEYBOARD_EVENT_PROPERTIES));
      });
    };
    window.addEventListener('keydown', keyboardEventHandler, true);
    window.addEventListener('keypress', keyboardEventHandler, true);
    window.addEventListener('keyup', keyboardEventHandler, true);
  }

  private async _addKeyEventListener(
    callback: CallbackFunction,
    target: string,
    eventType: KeyEventType,
    keyCode?: string,
    options: IAddKeyListenerOptions = {},
  ): Promise<void> {
    const handlerInfo = { eventType, callback, options };
    if (keyCode) {
      if (!this.registeredKeyHandlers[keyCode]) {
        this.registeredKeyHandlers[keyCode] = [];
      }
      this.registeredKeyHandlers[keyCode].push(handlerInfo);
    } else {
      this.registeredAnyKeyHandlers.push(handlerInfo);
    }
  }
}
