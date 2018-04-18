import { IMessage, IMessageCallback, IMessageEvent } from './common';

export abstract class Receiver<T> {
  protected constructor() {
    window.addEventListener('message', (event: IMessageEvent<T>) => {
      const message = event.data;

      if (!message.type || !message.args) {
        return;
      }

      this.handleMessage(message, (callbackMessage) => {
        if (!event.source) {
          return;
        }

        event.source.postMessage(callbackMessage, event.origin);
      });
    });
  }

  protected abstract handleMessage(
    message: IMessage<T>,
    callback: IMessageCallback<T>,
  ): void;
}
