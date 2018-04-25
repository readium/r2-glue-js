import { Sender } from '../../lib/sender';
import { EventHandlingMessage, IAddEventListenerOptions } from './common';

export class EventHandlingSender extends Sender {
  public addEventListener(
    target: string,
    eventType: string,
    listener: EventListenerOrEventListenerObject,
    options: IAddEventListenerOptions = {},
  ): void {

    this.sendMessage({
      type: EventHandlingMessage.AddEventListener,
      parameters: [target, eventType, options],
    });
  }
}
