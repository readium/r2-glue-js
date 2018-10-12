import { IMessage, Message, MessageType } from './message';
// TODO: Remove this when we have an appropriate solution for removing these event messages
declare global {
  interface Window { glueEventMessageRemovers: any; }
}

interface IMessageEvent extends MessageEvent {
  readonly data: IMessage;
}

export type sendMessage = (type: MessageType, name: string, parameters: any[]) => void;

export abstract class Receiver {
  private handler: (event: IMessageEvent) => void;

  protected constructor(namespace: string) {
    this.destroy = this.destroy.bind(this);

    this.handler = (event: IMessageEvent) => {
      const request = event.data;

      if (!Message.validate(request) || request.namespace !== namespace) {
        return;
      }

      this.processMessage(request, (type: MessageType, name: string, parameters: any[]) => {
        if (!event.source) {
          return;
        }

        const sourceWindow = <Window>event.source;

        sourceWindow.postMessage(
          new Message(namespace, type, name, parameters, request.correlationId),
          event.origin,
        );
      });
    };

    window.addEventListener('message', this.handler);
  }

  public destroy(): void {
    window.removeEventListener('message', this.handler);
  }

  protected abstract processMessage(message: IMessage, sendMessage: sendMessage): void;
}
