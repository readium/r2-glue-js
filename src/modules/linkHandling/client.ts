import { Client } from '../../lib/client';
import { EventHandlingMessage, IAddEventListenerOptions } from '../eventHandling/interface';

export class LinkHandling extends Client {
  public readonly typeName: string = 'LinkHandling';

  public constructor(targetWindow: Window) {
    super('link-handling', targetWindow);
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
