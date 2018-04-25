import { IMessage, IMessageEvent, Message } from './message';
import { uuid } from './util';
import { MessageHandler } from './messageHandler';

export class Dispatcher {
  private handler: MessageHandler;

  public constructor(namespace: string, handlerType: { new (): MessageHandler }) {
    this.handler = new handlerType();

    window.addEventListener('message', (event: IMessageEvent) => {
      const request = event.data;

      if (!Message.validate(request) || request.namespace !== namespace) {
        return;
      }

      this.handler[request.type].apply(this, [
        ...request.parameters,
        (response: IMessage) => {
          if (!event.source) {
            return;
          }

          event.source.postMessage(
            new Message(response, request.transitId || uuid()),
            event.origin,
          );
        },
      ]);
    });
  }
}
