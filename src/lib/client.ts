import { IMessage, MessageType } from '../lib';
import { MessageCallback } from './messageHandler';
import { Receiver } from './receiver';
import { Message } from './message';

interface MessageResponseInvokers {
  invokeReturn?: MessageCallback;
  invokeCallback?: MessageCallback;
}

export abstract class Client extends Receiver {
  private readonly _targetWindow: Window;
  private readonly _namespace: string;

  private readonly _messageCorrelations: { [id: string]: MessageResponseInvokers };

  protected constructor(namespace: string, targetWindow: Window) {
    super(namespace);
    this._namespace = namespace;
    this._targetWindow = targetWindow;
    this._messageCorrelations = {};
  }

  protected sendMessage(
    key: string,
    parameters: any[],
    callback?: MessageCallback,
  ): Promise<any> | void {
    const message = new Message(this._namespace, MessageType.Invoke, key, parameters);
    const correlations = this._getCorrelations(message.correlationId);
    if (callback) {
      correlations.invokeCallback = callback;
    }

    this._targetWindow.postMessage(message, this._targetWindow.location.origin);

    return new Promise((resolve) => {
      correlations.invokeReturn = resolve;
    });
  }

  protected processMessage(message: IMessage): void {
    if (!message.correlationId) {
      return;
    }

    const correlations = this._getCorrelations(message.correlationId);

    if (message.type === MessageType.Return && correlations.invokeReturn) {
      correlations.invokeReturn(message.value);
    }

    if (message.type === MessageType.Callback && correlations.invokeCallback) {
      correlations.invokeCallback(message.value);
    }
  }

  private _getCorrelations(id: string): MessageResponseInvokers {
    if (!this._messageCorrelations[id]) {
      this._messageCorrelations[id] = {};
    }

    return this._messageCorrelations[id];
  }
}
