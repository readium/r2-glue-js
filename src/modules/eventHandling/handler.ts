import finder from '@medv/finder';

import { MessageHandler, messageResponseCallback } from '../../lib';
import { EventHandlingMessage, IAddEventListenerOptions } from './interface';

export class EventHandler extends MessageHandler {
  private [EventHandlingMessage.AddEventListener](
    callback: messageResponseCallback,
    target: string,
    eventType: string,
    properties: string[],
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

          const pluckedEventArgs: any = {};
          properties.forEach((key) => {
            pluckedEventArgs[key] = (event as any)[key];
          });

          callback(
            JSON.parse(
              JSON.stringify(pluckedEventArgs, (key, value) => {
                if (value instanceof Window) {
                  return '@window';
                }
                if (value instanceof Document) {
                  return '@document';
                }
                if (value instanceof Node) {
                  // Generate a CSS selector for the Node
                  return finder(value);
                }
                return value;
              }),
            ),
          );
        });
      });
    }
  }
}
