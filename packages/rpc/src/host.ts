import { Message, MessageType } from './message';
import { ServiceConstructor, Service, CallHandler, CallHandlerList } from './service';
import { SendMessageFunction, Controller } from './controller';

export class Host extends Controller {
  private readonly _callHandlingService: Service;

  private readonly _registeredCallHandlers: { [key: string]: CallHandler[] } = {};

  public constructor(namespace: string, service: ServiceConstructor) {
    super(namespace);

    const _bind = (name: string, handler: CallHandler) => {
      if (!this._registeredCallHandlers[name]) {
        this._registeredCallHandlers[name] = [];
      }
      this._registeredCallHandlers[name].push(handler);
    };

    function bind(handlers: CallHandlerList): void;
    function bind(name: string, handler: CallHandler): void;
    function bind(handlersOrName: string | CallHandlerList, handler?: CallHandler): void {
      if (typeof handlersOrName === 'string' && handler) {
        _bind(handlersOrName, handler);
      } else {
        const handlers = handlersOrName as CallHandlerList;
        Object.keys(handlers).forEach((name) => {
          _bind(name, handlers[name]);
        });
      }
    }

    this._callHandlingService = new service({
      bind,
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

    const messageHandlers = this._registeredCallHandlers[message.name] || [];
    messageHandlers.forEach((messageHandler) => {
      messageHandler
        .apply(this._callHandlingService, [
          (...callbackData: any[]) => {
            sendMessage(MessageType.Callback, message.name, callbackData);
          },
          ...message.payload,
        ])
        .then((responseValue: any) => {
          sendMessage(MessageType.Respond, message.name, responseValue);
        });
    });
  }
}
