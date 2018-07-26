import { IMessage, Message, MessageType } from './message';

interface IMessageEvent extends MessageEvent {
  readonly data: IMessage;
}

export type sendMessage = (type: MessageType, name: string, parameters: any[]) => void;

export abstract class Receiver {
  protected constructor(namespace: string) {
    window.addEventListener('message', (event: IMessageEvent) => {
      const request = event.data;

      if (!Message.validate(request) || request.namespace !== namespace) {
        return;
      }

      this.processMessage(request, (type: MessageType, name: string, parameters: any[]) => {
        if (!event.source) {
          return;
        }

        event.source.postMessage(
          new Message(namespace, type, name, parameters, request.correlationId),
          event.origin,
        );
      });
    });
  }

  protected abstract processMessage(message: IMessage, sendMessage: sendMessage): void;
}
