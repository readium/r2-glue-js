import { Client } from '../../lib/client';
import { EventHandlingMessage } from '../eventHandling/interface';
import { Region, IAddRegionListenerOptions } from './interface';

export class RegionHandling extends Client {
  public typeName: string = 'RegionHandling';

  public constructor(targetWindow: Window) {
    super('region-handling', targetWindow);
  }

  public async addEventListener(
    eventType: string,
    region: Region,
    listener: EventListener,
    options: IAddRegionListenerOptions = {},
  ): Promise<number> {
    const properties: string[] = [];
    const target = 'body';

    options.region = region;
    let type = eventType;
    if (eventType === 'mouseenter' || eventType === 'mouseout') {
      type = 'mousemove';
      options.eventType = eventType;
    }

    return this.sendMessage(
      EventHandlingMessage.AddEventListener,
      [target, type, properties, options],
      (event) => {
        listener(event);
      },
    );
  }

  public removeEventListener(listenerID: number): void {
    this.sendMessage(EventHandlingMessage.RemoveEventListener, [listenerID]);
  }
}
