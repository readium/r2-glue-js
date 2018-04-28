import { Client } from '../../lib/client';
import { EventHandlingMessage, IAddEventListenerOptions } from './interface';

export class EventHandling extends Client {
  public constructor(targetWindow: Window) {
    super('event-handling', targetWindow);
  }

  public addEventListener(
    target: string,
    eventType: string,
    listener: EventListener,
    options: IAddEventListenerOptions = {},
  ): void {
    this.sendMessage(
      EventHandlingMessage.AddEventListener,
      [target, eventType, options],
      (event) => {
        listener(event);
      },
    );
  }
}
