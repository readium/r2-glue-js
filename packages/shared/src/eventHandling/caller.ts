import { Caller } from '@readium/glue-rpc';
import { EventHandlingMessage, IAddEventListenerOptions } from './interface';

export class EventHandling extends Caller {
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
    return this.call(
      EventHandlingMessage.AddEventListener,
      [target, eventType, properties, options],
      (event) => {
        listener(event);
      },
    );
  }

  public removeEventListener(listenerID: number): void {
    this.call(EventHandlingMessage.RemoveEventListener, [listenerID]);
  }
}
