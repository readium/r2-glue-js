import { IMessage } from './message';
import { MessageHandler } from './messageHandler';
import { sendMessage, Receiver } from './receiver';

export class Dispatcher extends Receiver {
  private handler: MessageHandler;

  public constructor(namespace: string, handlerType: { new(): MessageHandler }) {
    super(namespace);
    this.handler = new handlerType();
  }

  protected processMessage(message: IMessage, sendMessage: sendMessage): void {
    this.handler[message.type].apply(this, [
      (...responseParams: any[]) => {
        sendMessage(`${message.type}$response`, responseParams);
      },
      ...message.parameters,
    ]);
  }
}
