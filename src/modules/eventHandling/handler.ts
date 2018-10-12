import { MessageCallback, MessageHandler, MessageResponders } from '../../lib';
import { EventManager } from './eventManager';
import { EventHandlingMessage, IAddEventListenerOptions } from './interface';
import { marshalEvent } from '../../lib/marshaling';
import { resolveEventTargetSelector } from '../../lib/util';

export class EventHandler extends MessageHandler {
  public declarations: MessageResponders = {
    [EventHandlingMessage.AddEventListener]: this._addEventListener,
    [EventHandlingMessage.RemoveEventListener]: this._removeEventListener,
  };

  private eventManager: EventManager = new EventManager();

  protected createHandler(
    callback: MessageCallback,
    properties: string[],
    options: IAddEventListenerOptions,
    ): EventListener {
    return (event) => {
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
  }

  private async _addEventListener(
    callback: MessageCallback,
    target: string,
    eventType: string,
    properties: string[],
    options: IAddEventListenerOptions,
  ): Promise<number> {
    const targets = resolveEventTargetSelector(target);
    const handler: EventListener = this.createHandler(callback, properties, options);

    return this.eventManager.addEventListener(eventType, handler, options, targets);
  }

  private async _removeEventListener({}: MessageCallback, listenerID: number): Promise<void> {
    this.eventManager.removeEventListener(listenerID);
  }
}
