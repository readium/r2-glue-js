import { MessageHandler, MessageResponders, MessageCallback } from '../../lib';
import { EventHandlingMessage, IAddEventListenerOptions } from './interface';
import { marshalEvent } from '../../lib/marshaling';
import { resolveEventTargetSelector } from '../../lib/util';

interface IRegisteredEventListeners {
  type: string;
  listeners: EventListener[];
}

let lastUsedID = 0;

export class EventHandler extends MessageHandler {
  declarations: MessageResponders = {
    [EventHandlingMessage.AddEventListener]: this._addEventListener,
    [EventHandlingMessage.RemoveEventListener]: this._removeEventListener,
  };

  private registeredEventListenerRemovers: { [id: number]: Function[] } = {};

  private async _addEventListener(
    callback: MessageCallback,
    target: string,
    type: string,
    properties: string[],
    options: IAddEventListenerOptions,
  ): Promise<number> {
    const targets = resolveEventTargetSelector(target);

    const listenerRemovers = targets.map((resolvedTarget: EventTarget) => {
      const listener: EventListener = (event) => {
        if (options.preventDefault) {
          event.preventDefault();
        }
        if (options.stopPropagation) {
          event.stopPropagation();
        }
        if (options.stopImmediatePropagation) {
          event.stopImmediatePropagation();
        }

        callback(marshalEvent(event, properties));
      };
      resolvedTarget.addEventListener(type, listener);
      return () => {
        resolvedTarget.removeEventListener(type, listener);
      };
    });

    lastUsedID = lastUsedID + 1;
    this.registeredEventListenerRemovers[lastUsedID] = listenerRemovers;
    return lastUsedID;
  }

  private async _removeEventListener({}: MessageCallback, listenerID: number): Promise<void> {
    (this.registeredEventListenerRemovers[listenerID] || []).forEach((remove) => remove());
  }
}
