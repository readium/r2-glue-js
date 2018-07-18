import {IMessage, MessageType} from './message';
import { MessageHandler } from './messageHandler';
import { sendMessage, Receiver } from './receiver';

export class Dispatcher extends Receiver {
  private _handler: MessageHandler;

  public constructor(namespace: string, handlerType: { new (): MessageHandler }) {
    super(namespace);
    this._handler = new handlerType();
  }

  protected async processMessage(message: IMessage, sendMessage: sendMessage): Promise<void> {
    const handlerFunction = this._handler.declarations[message.name];
    const handlerReturnValue = await handlerFunction.apply(this._handler, [
      (...responseParams: any[]) => {
        sendMessage(MessageType.Yield, message.name, responseParams);
      },
      ...message.parameters,
    ]);
    sendMessage(MessageType.Reply, message.name, handlerReturnValue);
  }
}
