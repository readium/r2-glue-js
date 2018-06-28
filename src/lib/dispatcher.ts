import { IMessage } from './message';
import { MessageHandler } from './messageHandler';
import { sendMessage, Receiver } from './receiver';

export class Dispatcher extends Receiver {
  private _handler: MessageHandler;

  public constructor(namespace: string, handlerType: { new (): MessageHandler }) {
    super(namespace);
    this._handler = new handlerType();
  }

  protected processMessage(message: IMessage, sendMessage: sendMessage): void {
    this._handler.declarations[message.type].apply(this, [
      (...responseParams: any[]) => {
        sendMessage(`${message.type}$response`, responseParams);
      },
      ...message.parameters,
    ]);
  }
}
