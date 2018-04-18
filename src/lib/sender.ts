import { IMessage } from './common';

export abstract class Sender<ActionType> {
  private targetWindow: Window;

  protected constructor(targetWindow: Window) {
    this.targetWindow = targetWindow;
  }

  protected sendMessage(message: IMessage<ActionType>): void {
    this.targetWindow.postMessage(message, this.targetWindow.location.origin);
  }
}
