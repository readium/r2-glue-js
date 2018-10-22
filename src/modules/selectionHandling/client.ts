import { Client } from '../../lib/client';
import { EventHandlingMessage, IAddEventListenerOptions } from '../eventHandling/interface';

export class SelectionHandling extends Client {
  public typeName: string = 'SelectionHandling';

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
        event[1] = this;
        listener(event);
      },
    );
  }

  public removeEventListener(listenerID: number): void {
    this.sendMessage(EventHandlingMessage.RemoveEventListener, [listenerID]);
  }
}
