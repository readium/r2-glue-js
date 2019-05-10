import { Callback } from '@readium/glue-shared';

import { Controller } from './controller';
import { Message, MessageType } from './message';

interface MessageCorrelation {
  response?: Callback;
  callback?: Callback;
}

export abstract class Caller extends Controller {
  private readonly _targetWindow: Window;
  private readonly _namespace: string;

  private readonly _messageCorrelations: { [id: string]: MessageCorrelation };

  protected constructor(namespace: string, targetWindow: Window) {
    super(namespace);
    this._namespace = namespace;
    this._targetWindow = targetWindow;
    this._messageCorrelations = {};
  }

  protected call(name: string, parameters: any[], callback?: Callback): Promise<any> | void {
    const message = new Message({
      name,
      payload: parameters,
      namespace: this._namespace,
      type: MessageType.Request,
    });

    const correlation = this._getCorrelation(message.correlationId);
    if (callback) {
      correlation.callback = callback;
    }

    this._targetWindow.postMessage(message, this._targetWindow.location.origin);

    return new Promise((resolve) => {
      correlation.response = resolve;
    });
  }

  protected processMessage(message: Message): void {
    if (!message.correlationId) {
      return;
    }

    const correlation = this._getCorrelation(message.correlationId);

    if (message.type === MessageType.Respond && correlation.response) {
      correlation.response(message.payload);
    }

    if (message.type === MessageType.Callback && correlation.callback) {
      correlation.callback(message.payload);
    }
  }

  private _getCorrelation(id: string): MessageCorrelation {
    if (!this._messageCorrelations[id]) {
      this._messageCorrelations[id] = {};
    }

    return this._messageCorrelations[id];
  }
}
