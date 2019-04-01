import { Caller } from '@readium/glue-rpc';
import { KeyHandlingMessage, IAddKeyListenerOptions } from './interface';

export class KeyHandling extends Caller {
  public constructor(targetWindow: Window) {
    super('key-handling', targetWindow);
  }

  public addKeyEventListener(
    eventType: string,
    listener: EventListener,
    options: IAddKeyListenerOptions = {},
  ): void {
    this.call(
      KeyHandlingMessage.AddKeyEventListener,
      [eventType, options],
      (event) => {
        listener(event[0]);
      },
    );
  }

  public removeKeyEventListener(name: string): void {
    this.call(KeyHandlingMessage.RemoveKeyEventListener, [name]);
  }
}
