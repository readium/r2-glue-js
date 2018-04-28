import { IMessage, IMessageEvent, Message } from './message';

export type sendMessage = (type: string, parameters: any[]) => void;

export abstract class Receiver {

  protected constructor(namespace: string) {
    window.addEventListener('message', (event: IMessageEvent) => {
      const request = event.data;

      if (!Message.validate(request) || request.namespace !== namespace) {
        return;
      }

      this.processMessage(request, (message) => {
        if (!event.source) {
          return;
        }

        event.source.postMessage(message, event.origin);
      });
    });
  }

  protected abstract processMessage(message: IMessage, postMessage: sendMessage): void;
}
