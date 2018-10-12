import { MessageCallback } from '../../lib';
import { IAddEventListenerOptions } from '../eventHandling/interface';
import { marshalObject } from '../../lib/marshaling';
import { EventHandler } from '../eventHandling/handler';
import { eventPath } from '../../lib/util';

export class LinkHandler extends EventHandler {

  protected createHandler(
    callback: MessageCallback,
    properties: string[],
    options: IAddEventListenerOptions,
    ): EventListener {
    return (event) => {
      const path =  eventPath(event);

      let i = 0;
      const length = path.length;
      let anchor: HTMLAnchorElement | null = null;
      // tslint:disable-next-line:no-increment-decrement
      for (i; i < length; i++) {
        if (path[i].tagName === 'a') anchor = path[i];
      }
      if (!anchor) return;

      const href = anchor && anchor.href;
      if (!href)  return;

      event.preventDefault();
      event.stopPropagation();

      if (options.stopImmediatePropagation) {
        event.stopImmediatePropagation();
      }

      const newHref = { href: anchor.href };
      const obj = marshalObject(newHref);
      callback(obj);
    };
  }
}
