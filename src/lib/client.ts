import { IMessage, MessageType } from '../lib';
import { MessageCallback } from './messageHandler';
import { sendMessage, Receiver } from './receiver';
import { Message } from './message';

interface MessageCorrelationResponses {
  replyCallback?: MessageCallback;
  yieldCallback?: MessageCallback;
}

export abstract class Client extends Receiver {
  private readonly _targetWindow: Window;
  private readonly _namespace: string;

  private readonly _messageCorrelations: { [id: string]: MessageCorrelationResponses };

  protected constructor(namespace: string, targetWindow: Window) {
    super(namespace);
    this._namespace = namespace;
    this._targetWindow = targetWindow;
    this._messageCorrelations = {};
  }

  protected sendMessage(
    name: string,
    parameters: any[],
    callback?: MessageCallback,
  ): Promise<any> | void {
    const message = new Message(this._namespace, MessageType.Call, name, parameters);
    const correlations = this._getCorrelations(message.correlationId);
    if (callback) {
      correlations.yieldCallback = callback;
    }

    this._targetWindow.postMessage(message, this._targetWindow.location.origin);

    return new Promise((resolve) => {
      correlations.replyCallback = resolve;
    });
  }

  protected async processMessage(message: IMessage, sendMessage: sendMessage): Promise<void> {
    if (!message.correlationId) {
      return;
    }

    const correlations = this._getCorrelations(message.correlationId);

    if (message.type === MessageType.Reply && correlations.replyCallback) {
      correlations.replyCallback(message.parameters);
    }

    if (message.type === MessageType.Yield && correlations.yieldCallback) {
      correlations.yieldCallback(message.parameters);
    }
  }

  private _getCorrelations(id: string): MessageCorrelationResponses {
    if (!this._messageCorrelations[id]) {
      this._messageCorrelations[id] = {};
    }

    return this._messageCorrelations[id];
  }
}
