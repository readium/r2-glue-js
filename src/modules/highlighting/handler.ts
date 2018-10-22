import { MessageCallback, MessageHandler, MessageResponders } from '../../lib';
import { marshalObject } from '../../lib/marshaling';
import { EventHandlingMessage, IHighlightOptions } from './interface';
import { RangeData, createRangeFromRangeData } from '../utilities/rangeData';

export class Highlighter extends MessageHandler {
  public declarations: MessageResponders = {
    [EventHandlingMessage.CreateHighlight]: this._createHighlight,
  };

  private async _createHighlight(
    callback: MessageCallback,
    rangeData: RangeData,
    options: IHighlightOptions,
  ): Promise<number> {
    const range = createRangeFromRangeData(rangeData);
    let highlights = document.getElementById('highlights');
    if (!highlights) highlights = this._createHighlightContainer();
    const clientRect = range.getBoundingClientRect();

    const highlight = this._createHighlightDiv(clientRect);
    highlights.append(highlight);

    return 1;
  }

  private _createHighlightContainer(): HTMLElement {
    const div = document.createElement('div');
    div.setAttribute('id', 'highlights');
    document.body.prepend(div);

    return div;
  }

  private _createHighlightDiv(clientRect: ClientRect | DOMRect): HTMLDivElement {
    const highlight = document.createElement('div');
    highlight.style.setProperty('position', 'absolute');
    highlight.style.setProperty('background', 'rgba(220, 255, 15, 0.40)');
    highlight.style.setProperty('width', `${clientRect.width}px`);
    highlight.style.setProperty('height', `${clientRect.height}px`);
    highlight.style.setProperty('left', `${clientRect.left}px`);
    highlight.style.setProperty('top', `${clientRect.top}px`);

    return highlight;
  }
}
