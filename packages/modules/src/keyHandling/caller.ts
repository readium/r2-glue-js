import { Caller } from '@readium/glue-rpc';

import { KeyHandlingMessage, IAddKeyListenerOptions } from './interface';

export class KeyHandling extends Caller {
  public async addKeyEventListener(
    eventType: string,
    listener: EventListener,
    options: IAddKeyListenerOptions = {},
  ): Promise<number> {
    return this.call(KeyHandlingMessage.AddKeyEventListener, [eventType, options], (payload) => {
      listener(payload[0]);
    });
  }

  public removeKeyEventListener(id: number): void {
    this.call(KeyHandlingMessage.RemoveKeyEventListener, [id]);
  }
}
