import { MessageCallback } from '../../lib';
import { EventHandler } from '../eventHandling/handler';
import { IAddRegionListenerOptions, RegionScope } from './interface';

export class RegionHandler extends EventHandler {

  protected createHandler(
    callback: MessageCallback,
    properties: string[],
    options: IAddRegionListenerOptions,
    ): EventListener {
    return (event) => {
      event.preventDefault();

      if (options.stopPropagation) {
        event.stopPropagation();
      }
      if (options.stopImmediatePropagation) {
        event.stopImmediatePropagation();
      }
      const region = options.region;
      const eventType = options.eventType;
      if (!region) {
        console.error('"region" was not passed into RegionHandler');
        return;
      }

      let x = (<MouseEvent> event).clientX;
      let y = (<MouseEvent> event).clientY;
      if (region.scope === RegionScope.Document) {
        x = (<MouseEvent> event).pageX;
        y = (<MouseEvent> event).pageY;
      }

      options.wasWithinRegion = options.withinRegion;
      options.withinRegion =
        (x >= region.left && x <= region.left + region.width) &&
        (y >= region.top && y <= region.top + region.height);

      let shouldCallback = options.withinRegion;
      if (eventType === 'mouseenter') {
        shouldCallback = (options.wasWithinRegion === false && options.withinRegion === true);
      } else if (eventType === 'mouseout') {
        shouldCallback = (options.wasWithinRegion === true && options.withinRegion === false);
      }

      if (shouldCallback) {
        console.log(this);
        callback();
      }
    };
  }
}
