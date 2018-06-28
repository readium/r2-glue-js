import { Client } from '../../lib/client';
import { KeyHandlingMessage, IAddKeyListenerOptions } from './interface';

export class KeyHandling extends Client {
  public constructor(targetWindow: Window) {
    super('key-handling', targetWindow);
  }

  public addKeyEventListener(
    target: string,
    eventType: string,
    keyCode: string,
    listener: EventListener,
    options: IAddKeyListenerOptions = {},
  ): void {
    this.sendMessage(
      KeyHandlingMessage.AddKeyEventListener,
      [target, eventType, keyCode, options],
      (event) => {
        listener(event);
      },
    );
  }
}
