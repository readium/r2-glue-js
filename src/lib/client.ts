import { IMessage } from '../lib';
import { messageResponseCallback } from './messageHandler';
import { sendMessage, Receiver } from './receiver';
import { Message } from './message';

export abstract class Client extends Receiver {
  private targetWindow: Window;

  private readonly messageCorrelations: { [id: string]: messageResponseCallback[] };

  protected constructor(namespace: string, targetWindow: Window) {
    super(namespace);
    this.targetWindow = targetWindow;
    this.messageCorrelations = {};
  }

  protected sendMessage(
    type: string,
    parameters: any[],
    responseCallback?: messageResponseCallback,
  ): void {
    const message = new Message(type, parameters);
    if (responseCallback) {
      const correlations = this.getCorrelations(message.correlationId);
      correlations.push(responseCallback);
    }

    this.targetWindow.postMessage(message, this.targetWindow.location.origin);
  }

  protected processMessage(message: IMessage, sendMessage: sendMessage): void {
    if (!message.correlationId) {
      return;
    }

    const correlations = this.getCorrelations(message.correlationId);
    correlations.forEach((callback) => {
      callback(...message.parameters);
    });
  }

  private getCorrelations(id: string): messageResponseCallback[] {
    if (!this.messageCorrelations[id]) {
      this.messageCorrelations[id] = [];
    }

    return this.messageCorrelations[id];
  }
}
