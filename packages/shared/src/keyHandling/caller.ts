import { GlueCaller } from '@readium/glue-rpc';
import { KeyHandlingMessage, IAddKeyListenerOptions } from './interface';

export class KeyHandling extends GlueCaller {
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
    this.call(
      KeyHandlingMessage.AddKeyEventListener,
      [target, eventType, keyCode, options],
      (event) => {
        listener(event);
      },
    );
  }
}
