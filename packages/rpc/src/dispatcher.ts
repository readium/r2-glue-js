import { Message, MessageType } from './message';
import { MessageHandling } from './messageHandling';
import { SendMessageFunction, Controller } from './controller';

export class Dispatcher extends Controller {
  private readonly _messageHandlingInstance: MessageHandling;

  public constructor(namespace: string, messageHandlingType: { new (): MessageHandling }) {
    super(namespace);
    this._messageHandlingInstance = new messageHandlingType();
  }

  protected processMessage(message: Message, sendMessage: SendMessageFunction): void {
    this._messageHandlingInstance.handlers[message.key]
      .apply(this._messageHandlingInstance, [
        (...callbackData: any[]) => {
          sendMessage(MessageType.Callback, message.key, callbackData);
        },
        ...message.value,
      ])
      .then((responseValue: any) => {
        sendMessage(MessageType.Respond, message.key, responseValue);
      });
  }
}
