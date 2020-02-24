import { Caller } from '@readium/glue-rpc';

import { EventHandlingMessage, IAddEventListenerOptions } from './interface';

export class EventHandling extends Caller {
  public async addEventListener(
    eventType: string,
    listener: EventListener,
    options: IAddEventListenerOptions = {},
  ): Promise<number> {
    return this.call(EventHandlingMessage.AddEventListener, [eventType, options], (payload) => {
      listener(payload[0]);
    });
  }

  public async removeEventListener(listenerID: number): Promise<void> {
    return this.call(EventHandlingMessage.RemoveEventListener, [listenerID]);
  }
}
