import { Caller } from '@readium/glue-rpc';
import { EventHandlingMessage, IAddEventListenerOptions } from './interface';

export class EventHandling extends Caller {
  public constructor(targetWindow: Window) {
    super('event-handling', targetWindow);
  }

  public async addEventListener(
    eventType: string,
    listener: EventListener,
    options: IAddEventListenerOptions = {},
  ): Promise<number> {
    return this.call(EventHandlingMessage.AddEventListener, [eventType, options], (payload) => {
      listener(payload[0]);
    });
  }

  public removeEventListener(listenerID: number): void {
    this.call(EventHandlingMessage.RemoveEventListener, [listenerID]);
  }
}
