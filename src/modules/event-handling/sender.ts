import { Sender } from '../../lib/sender';
import { EventHandlingMessage, IAddEventListenerOptions } from './common';

export class EventHandlingSender extends Sender<EventHandlingMessage> {
  public addEventListener(
    target: string,
    eventType: string,
    options: IAddEventListenerOptions = {},
  ): void {
    this.sendMessage({
      type: EventHandlingMessage.AddEventListener,
      args: [target, eventType, options],
    });
  }
}
