import { IMessage } from './message';

export abstract class Sender {
  private targetWindow: Window;

  protected constructor(targetWindow: Window) {
    this.targetWindow = targetWindow;
  }

  protected sendMessage(message: IMessage): void {
    this.targetWindow.postMessage(message, this.targetWindow.location.origin);
  }
}
