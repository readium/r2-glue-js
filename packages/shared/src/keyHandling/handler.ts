import { Callback, CallSource, Service } from '@readium/glue-rpc';
import { KeyHandlingMessage, IAddKeyListenerOptions, KeyEventType } from './interface';
import { marshalEvent } from '@readium/glue-rpc/lib/marshaling';

interface IRegisteredKeyHandler {
  eventType: KeyEventType;
  callback: Callback;
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

export class KeyHandler extends Service {
  private readonly registeredKeyHandlers: { [key: string]: IRegisteredKeyHandler[] } = {};
  private readonly registeredAnyKeyHandlers: IRegisteredKeyHandler[] = [];

  constructor(messageSource: CallSource) {
    super(messageSource);

    messageSource.bind(KeyHandlingMessage.AddKeyEventListener, this._addKeyEventListener);
    messageSource.bind(KeyHandlingMessage.RemoveKeyEventListener, this._removeKeyEventListener);

    const keyboardEventHandler = (event: KeyboardEvent) => {
      if (event.defaultPrevented) {
        // Skip if event is already handled
        return;
      }

      const matchingKeyHandlerSet = [
        ...(this.registeredKeyHandlers[event.keyCode] || []),
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
    callback: Callback,
    eventType: KeyEventType,
    options: IAddKeyListenerOptions = {},
  ): Promise<void> {
    const handlerInfo = { eventType, callback, options };
    if (options.keyCode) {
      if (!this.registeredKeyHandlers[options.keyCode]) {
        this.registeredKeyHandlers[options.keyCode] = [];
      }
      this.registeredKeyHandlers[options.keyCode].push(handlerInfo);
    } else {
      this.registeredAnyKeyHandlers.push(handlerInfo);
    }
  }

  private async _removeKeyEventListener(
    callback: Callback,
    name: string,
  ): Promise<void> {
    const searcher = (x: any) => { return x.options.listenerId === name; };
    for (const [_k, v] of Object.entries(this.registeredKeyHandlers)) {
      let idx = v.findIndex(searcher);
      while (idx >= 0) {
        v.splice(idx, 1);
        idx = v.findIndex(searcher);
      }
    }
    let idx = this.registeredAnyKeyHandlers.findIndex(searcher);
    while (idx >= 0) {
      this.registeredAnyKeyHandlers.splice(idx, 1);
      idx = this.registeredAnyKeyHandlers.findIndex(searcher);
    }
  }
}
