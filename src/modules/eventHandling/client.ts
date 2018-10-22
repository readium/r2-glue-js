import { Client } from '../../lib/client';
import { EventHandlingMessage, IAddEventListenerOptions } from './interface';

export class EventHandling extends Client {
  public readonly typeName: string = 'EventHandling';

  public constructor(targetWindow: Window) {
    super('event-handling', targetWindow);
  }

  public async addEventListener(
    target: string,
    eventType: string,
    properties: string[],
    listener: EventListener,
    options: IAddEventListenerOptions = {},
  ): Promise<number> {
    return this.sendMessage(
      EventHandlingMessage.AddEventListener,
      [target, eventType, properties, options],
      (event) => {
        listener(event);
      },
    );
  }

  public removeEventListener(listenerID: number): void {
    this.sendMessage(EventHandlingMessage.RemoveEventListener, [listenerID]);
  }
}
