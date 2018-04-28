import { MessageHandler, messageResponseCallback } from '../../lib';
import { EventHandlingMessage, IAddEventListenerOptions } from './interface';

export class EventHandler extends MessageHandler {
  private [EventHandlingMessage.AddEventListener](
    callback: messageResponseCallback,
    target: string,
    eventType: string,
    options: IAddEventListenerOptions,
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

          callback(event);
        });
      });
    }
  }
}
