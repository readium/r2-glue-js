import { Callback, CallSource, marshalEvent, EventListenerService } from '@readium/glue-shared';

import { EventHandlingMessage, IAddEventListenerOptions } from './interface';

export class EventHandling extends EventListenerService {
  constructor(source: CallSource) {
    super(source);
    source.bind(EventHandlingMessage.AddEventListener, this._addEventListener);
    source.bind(EventHandlingMessage.RemoveEventListener, this._removeEventListener);
  }

  private async _addEventListener(
    callback: Callback,
    eventType: string,
    options: IAddEventListenerOptions,
  ): Promise<number> {
    const listener: EventListener = (event) => {
      if (options.preventDefault) {
        event.preventDefault();
      }
      if (options.stopPropagation) {
        event.stopPropagation();
      }
      if (options.stopImmediatePropagation) {
        event.stopImmediatePropagation();
      }

      callback(marshalEvent(event, options.properties || []));
    };
    const target = options.target || '@window';
    return this.registerListenerForTargets(target, eventType, listener);
  }

  private async _removeEventListener(_callback: Callback, listenerID: number): Promise<void> {
    this.removeEventListeners(listenerID);
  }
}
