import { Message, MessageType } from './message';
import { HandledMessage } from './handledMessage';

interface MessageEventWithData extends MessageEvent {
  readonly data: HandledMessage;
}

export type SendMessageFunction = (type: MessageType, name: string, parameters: any[]) => void;

export abstract class Controller {
  protected constructor(namespace: string) {
    window.addEventListener('message', (event: MessageEventWithData) => {
      const request = event.data;

      if (!HandledMessage.validate(request) || request.namespace !== namespace) {
        return;
      }

      this.processMessage(request, (type: MessageType, name: string, parameters: any[]) => {
        if (!event.source) {
          return;
        }

        const sourceWindow = <Window>event.source;

        sourceWindow.postMessage(
          new HandledMessage(namespace, type, name, parameters, request.correlationId),
          event.origin,
        );
      });
    });
  }

  protected abstract processMessage(message: Message, sendMessage: SendMessageFunction): void;
}
