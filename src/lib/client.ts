import { IMessage } from '../lib';
import { messageResponseCallback } from './messageHandler';
import { sendMessage, Receiver } from './receiver';
import { Message } from './message';

export abstract class Client extends Receiver {
  private readonly _targetWindow: Window;
  private readonly _namespace: string;

  private readonly _messageCorrelations: { [id: string]: messageResponseCallback[] };

  protected constructor(namespace: string, targetWindow: Window) {
    super(namespace);
    this._namespace = namespace;
    this._targetWindow = targetWindow;
    this._messageCorrelations = {};
  }

  protected sendMessage(
    type: string,
    parameters: any[],
    responseCallback?: messageResponseCallback,
  ): void {
    const message = new Message(this._namespace, type, parameters);
    if (responseCallback) {
      const correlations = this._getCorrelations(message.correlationId);
      correlations.push(responseCallback);
    }

    this._targetWindow.postMessage(message, this._targetWindow.location.origin);
  }

  protected processMessage(message: IMessage, sendMessage: sendMessage): void {
    if (!message.correlationId) {
      return;
    }

    const correlations = this._getCorrelations(message.correlationId);
    correlations.forEach((callback) => {
      callback(...message.parameters);
    });
  }

  private _getCorrelations(id: string): messageResponseCallback[] {
    if (!this._messageCorrelations[id]) {
      this._messageCorrelations[id] = [];
    }

    return this._messageCorrelations[id];
  }
}
