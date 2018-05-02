import { Client } from '../../lib/client';
import { KeyHandlingMessage, IAddKeyListenerOptions } from './interface';

export class KeyHandling extends Client {
  public constructor(targetWindow: Window) {
    super('key-handling', targetWindow);
  }

  public addEventListener(
    target: string,
    eventType: string,
    properties: string[],
    listener: EventListener,
    options: IAddKeyListenerOptions = {},
  ): void {
    this.sendMessage(
      KeyHandlingMessage.AddKeyEventListener,
      [target, eventType, properties, options],
      (event) => {
        listener(event);
      },
    );
  }
}
