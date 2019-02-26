import { CallbackFunction } from './service';
import { Controller } from './controller';
import { Message, MessageType } from './message';

interface MessageCorrelation {
  response?: CallbackFunction;
  callback?: CallbackFunction;
}

export abstract class GlueCaller extends Controller {
  private readonly _targetWindow: Window;
  private readonly _namespace: string;

  private readonly _messageCorrelations: { [id: string]: MessageCorrelation };

  protected constructor(namespace: string, targetWindow: Window) {
    super(namespace);
    this._namespace = namespace;
    this._targetWindow = targetWindow;
    this._messageCorrelations = {};
  }

  protected call(
    name: string,
    parameters: any[],
    callback?: CallbackFunction,
  ): Promise<any> | void {
    const message = new Message({
      name,
      payload: parameters,
      namespace: this._namespace,
      type: MessageType.Request,
    });

    const correlations = this._getCorrelations(message.correlationId);
    if (callback) {
      correlations.callback = callback;
    }

    this._targetWindow.postMessage(message, this._targetWindow.location.origin);

    return new Promise((resolve) => {
      correlations.response = resolve;
    });
  }

  protected processMessage(message: Message): void {
    if (!message.correlationId) {
      return;
    }

    const correlations = this._getCorrelations(message.correlationId);

    if (message.type === MessageType.Respond && correlations.response) {
      correlations.response(message.payload);
    }

    if (message.type === MessageType.Callback && correlations.callback) {
      correlations.callback(message.payload);
    }
  }

  private _getCorrelations(id: string): MessageCorrelation {
    if (!this._messageCorrelations[id]) {
      this._messageCorrelations[id] = {};
    }

    return this._messageCorrelations[id];
  }
}
