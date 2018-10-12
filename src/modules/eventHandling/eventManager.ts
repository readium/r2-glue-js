import { AbstractEventManager } from './abstractEventManager';
import { IAddEventListenerOptions } from './interface';
import { MessageCallback } from '../../lib';

export class EventManager extends AbstractEventManager {
  private registeredEventRemovers: { [id: number]: Function[] } = {};

  public addEventListener(
    type: string,
    callback: MessageCallback,
    options?: IAddEventListenerOptions,
    resolvedTargets?: EventTarget[],
  ): number {
    let resolved = resolvedTargets;
    if (!(resolved && resolved.length)) resolved = [window];

    const listenerRemovers = resolved.map((resolvedTarget: EventTarget) => {
      resolvedTarget.addEventListener(type, callback, options);

      return () => {
        resolvedTarget.removeEventListener(type, callback, options);
      };
    });

    const id = super.addEventListener(type, callback, options);
    this.registeredEventRemovers[id] = listenerRemovers;

    return id;
  }

  public removeEventListener(id: number): void {
    super.removeEventListener(id);

    const eventRemovers = this.registeredEventRemovers[id] || [];
    eventRemovers.forEach((remove) => {
      remove();
    });

    delete this.registeredEventRemovers[id];
  }
}
