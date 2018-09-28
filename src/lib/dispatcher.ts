import { IMessage, MessageType } from './message';
import { MessageHandler } from './messageHandler';
import { sendMessage, Receiver } from './receiver';

export class Dispatcher extends Receiver {
  private readonly _handler: MessageHandler;

  public constructor(namespace: string, handlerType: { new (): MessageHandler }) {
    super(namespace);
    this._handler = new handlerType();
  }

  protected processMessage(message: IMessage, sendMessage: sendMessage): void {
    this._handler.declarations[message.key]
      .apply(this._handler, [
        (...yieldValues: any[]) => {
          sendMessage(MessageType.Yield, message.key, yieldValues);
        },
        ...message.value,
      ])
      .then((returnValue: any) => sendMessage(MessageType.Reply, message.key, returnValue));
  }
}
