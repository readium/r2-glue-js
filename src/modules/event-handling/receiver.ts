import { IMessage, IMessageCallback } from '../../lib/common';
import { Receiver } from '../../lib/receiver';
import { EventHandlingMessage, IAddEventListenerOptions } from './common';

export class EventHandlingReceiver extends Receiver<EventHandlingMessage> {
  protected handleMessage(
    message: IMessage<EventHandlingMessage>,
    callback: IMessageCallback<EventHandlingMessage>,
  ): void {
    if (message.type === EventHandlingMessage.AddEventListener) {
      const [target, eventType, options = {}] = message.args;
      this.onEventListener(String(target), String(eventType), options, callback);
    }
  }

  private onEventListener(
    target: string,
    eventType: string,
    options: IAddEventListenerOptions,
    callback: IMessageCallback<EventHandlingMessage>,
  ): void {
    let eventTargets;
    if (target === '@window') {
      eventTargets = [window];
    } else if (target === '@document') {
      eventTargets = [document];
    } else {
      eventTargets = document.querySelectorAll(target);
    }

    if (eventTargets && eventTargets.length) {
      Array.prototype.forEach.call(eventTargets, (resolvedTarget: EventTarget) => {
        resolvedTarget.addEventListener(eventType, (event) => {
          if (options.preventDefault) {
            event.preventDefault();
          }
          if (options.stopPropagation) {
            event.stopPropagation();
          }
          if (options.stopImmediatePropagation) {
            event.stopImmediatePropagation();
          }

          callback({
            type: EventHandlingMessage.Event,
            args: [event],
          });
        });
      });
    }
  }
}
