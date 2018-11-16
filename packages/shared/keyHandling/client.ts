import { Caller } from '@teadium/glue-rpc/lib/caller';
import { KeyHandlingMessage, IAddKeyListenerOptions } from './interface';

export class KeyHandling extends Caller {
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
