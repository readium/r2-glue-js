import { Message, MessageType } from './message';
import { GlueServiceConstructor, GlueService, CallHandler } from './service';
import { SendMessageFunction, Controller } from './controller';

export class GlueHost extends Controller {
  private readonly _callHandlingService: GlueService;

  private readonly _registeredCallHandlers: { [key: string]: CallHandler[] } = {};

  public constructor(namespace: string, service: GlueServiceConstructor) {
    super(namespace);

    this._callHandlingService = new service({
      bind: (name, handler) => {
        if (!this._registeredCallHandlers[name]) {
          this._registeredCallHandlers[name] = [];
        }
        this._registeredCallHandlers[name].push(handler);
      },
      unbind: (name, handler) => {
        const messageHandlers = this._registeredCallHandlers[name];
        messageHandlers.splice(messageHandlers.indexOf(handler), 1);
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

    const messageHandlers = this._registeredCallHandlers[message.key] || [];
    messageHandlers.forEach((messageHandler) => {
      messageHandler
        .apply(this._callHandlingService, [
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
