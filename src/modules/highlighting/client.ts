import { Client } from '../../lib/client';
import { EventHandlingMessage, IHighlightOptions } from './interface';
import { RangeData } from '../utilities/rangeData';

export class Highlighting extends Client {
  public typeName: string = 'Highlighting';

  public constructor(targetWindow: Window) {
    super('highlighting', targetWindow);
  }

  public async createHighlight(
    rangeData: RangeData,
    options?: IHighlightOptions,
  ): Promise<void> {

    return this.sendMessage(
      EventHandlingMessage.CreateHighlight,
      [rangeData, options],
    );
  }
}
