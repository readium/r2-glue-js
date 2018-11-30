import { Message, MessageType } from './message';
import { Executor, ExecutorConstructor } from './executor';
import { SendMessageFunction, Controller } from './controller';

export class Dispatcher extends Controller {
  private readonly _messageHandlingInstance: Executor;

  public constructor(namespace: string, executor: ExecutorConstructor) {
    super(namespace);
    this._messageHandlingInstance = new executor({
      addListener: (messaseType, messageHandler) => {

      },
      removeListener: (messaseType, messageHandler) => {

      },
    });
  }

  protected processMessage(message: Message, sendMessage: SendMessageFunction): void {
    // this._messageHandlingInstance.handlers[message.key]
    //   .apply(this._messageHandlingInstance, [
    //     (...callbackData: any[]) => {
    //       sendMessage(MessageType.Callback, message.key, callbackData);
    //     },
    //     ...message.value,
    //   ])
    //   .then((responseValue: any) => {
    //     sendMessage(MessageType.Respond, message.key, responseValue);
    //   });
  }
}
