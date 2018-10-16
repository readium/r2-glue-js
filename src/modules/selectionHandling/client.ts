import { Client } from '../../lib/client';
import { EventHandlingMessage, IAddEventListenerOptions } from '../eventHandling/interface';

export class SelectionHandling extends Client {
  public constructor(targetWindow: Window) {
    super('selection-handling', targetWindow);
  }

  public async addEventListener(
    target: string,
    listener: EventListener,
    options: IAddEventListenerOptions = {},
  ): Promise<number> {
    const eventType = 'mouseup';
    const properties: string[] = [];
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
