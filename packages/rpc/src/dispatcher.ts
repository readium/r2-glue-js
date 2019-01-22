import { Message, MessageType } from './message';
import { ExecutorConstructor, Executor, MessageHandler } from './executor';
import { SendMessageFunction, Controller } from './controller';

export class Dispatcher extends Controller {
  private readonly _messageHandlingInstance: Executor;

  private readonly _registeredMessageHandlers: { [key: string]: MessageHandler[] } = {};

  public constructor(namespace: string, executor: ExecutorConstructor) {
    super(namespace);

    this._messageHandlingInstance = new executor({
      addListener: (messageKey, messageHandler) => {
        if (!this._registeredMessageHandlers[messageKey]) {
          this._registeredMessageHandlers[messageKey] = [];
        }
        this._registeredMessageHandlers[messageKey].push(messageHandler);
      },
      removeListener: (messageKey, messageHandler) => {
        const messageHandlers = this._registeredMessageHandlers[messageKey];
        messageHandlers.splice(messageHandlers.indexOf(messageHandler), 1);
      },
    });
  }

  public destroy(): void {
    super.destroy();
  }

  protected processMessage(message: Message, sendMessage: SendMessageFunction): void {
    if (message.type !== MessageType.Request) {
      return;
    }

    const messageHandlers = this._registeredMessageHandlers[message.key] || [];
    messageHandlers.forEach((messageHandler) => {
      messageHandler
        .apply(this._messageHandlingInstance, [
          (...callbackData: any[]) => {
            sendMessage(MessageType.Callback, message.key, callbackData);
          },
          ...message.value,
        ])
        .then((responseValue: any) => {
          sendMessage(MessageType.Respond, message.key, responseValue);
        });
    });
  }
}
