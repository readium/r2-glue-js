import { Client } from '../../lib/client';
import { KeyHandlingMessage, IAddKeyListenerOptions } from './interface';

export class KeyHandling extends Client {
  public constructor(targetWindow: Window) {
    super('key-handling', targetWindow);
  }

  public async addKeyEventListener(
    target: string,
    eventType: string,
    keyCode: string,
    listener: EventListener,
    options: IAddKeyListenerOptions = {},
  ): Promise<number> {
    return this.sendMessage(
      KeyHandlingMessage.AddKeyEventListener,
      [target, eventType, keyCode, options],
      (event) => {
        listener(event);
      },
    );
  }

  public removeKeyEventListener(listenerID: number): void {
    this.sendMessage(KeyHandlingMessage.RemoveKeyEventListener, [listenerID]);
  }
}
