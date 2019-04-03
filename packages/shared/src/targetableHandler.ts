import { Service, CallSource } from '@readium/glue-rpc';

import { resolveEventTargetSelector } from '@readium/glue-rpc/lib/util';

export type EventListenerGenerator = (target: EventTarget) => EventListener;

export class TargetableHandler extends Service {
  constructor(source: CallSource) {
    super(source);
  }

  private lastUsedID: number = 0;
  private registeredEventListenerRemovers: { [id: number]: Function[] } = {};

  // tslint:disable-next-line:max-line-length
  protected registerListenerForTargets(target: string, type: string, listener: EventListener): number {
    const targets = resolveEventTargetSelector(target);
    const listenerRemovers = targets.map((resolvedTarget: EventTarget) => {
      resolvedTarget.addEventListener(type, listener);
      return () => {
        resolvedTarget.removeEventListener(type, listener);
      };
    });
    this.lastUsedID = this.lastUsedID + 1;
    this.registeredEventListenerRemovers[this.lastUsedID] = listenerRemovers;
    return this.lastUsedID;
  }

  // tslint:disable-next-line:max-line-length
  protected registerListenerForEachTarget(target: string, type: string, generator: EventListenerGenerator): number {
    const targets = resolveEventTargetSelector(target);
    const listenerRemovers = targets.map((resolvedTarget: EventTarget) => {
      const listener = generator(resolvedTarget);
      resolvedTarget.addEventListener(type, listener);
      return () => {
        resolvedTarget.removeEventListener(type, listener);
      };
    });
    this.lastUsedID = this.lastUsedID + 1;
    this.registeredEventListenerRemovers[this.lastUsedID] = listenerRemovers;
    return this.lastUsedID;
  }

  protected removeEventListeners(listenerID: number): void {
    (this.registeredEventListenerRemovers[listenerID] || []).forEach((remove) => remove());
  }

  protected peekId(): number {
    return this.lastUsedID + 1;
  }
}
