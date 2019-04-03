import { Callback, CallSource } from '@readium/glue-rpc';
import { KeyHandlingMessage, IAddKeyListenerOptions, KeyEventType } from './interface';
import { marshalEvent } from '@readium/glue-rpc/lib/marshaling';
import { TargetableHandler } from '../targetableHandler';

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

export class KeyHandler extends TargetableHandler {
  constructor(messageSource: CallSource) {
    super(messageSource);

    messageSource.bind(KeyHandlingMessage.AddKeyEventListener, this._addKeyEventListener);
    messageSource.bind(KeyHandlingMessage.RemoveKeyEventListener, this._removeKeyEventListener);
  }

  private async _addKeyEventListener(
    callback: Callback,
    eventType: KeyEventType,
    options: IAddKeyListenerOptions = {},
  ): Promise<number> {
    const peekedId = this.peekId();
    const keyboardEventHandler = (event: Event) => {
      if (event.defaultPrevented) {
        // Skip if event is already handled
        return;
      }

      if (eventType !== event.type) {
        return;
      }

      if (options.preventDefault) {
        event.preventDefault();
      }

      if (options.once) {
        this.removeEventListeners(peekedId);
      }

      callback(marshalEvent(event, KEYBOARD_EVENT_PROPERTIES));
    };
    const target = options.target || '@window';
    return this.registerListenerForTargets(target, eventType, keyboardEventHandler);
  }

  private async _removeKeyEventListener(callback: Callback, id: number): Promise<void> {
    this.removeEventListeners(id);
  }
}
