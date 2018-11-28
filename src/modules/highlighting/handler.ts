import { MessageCallback, MessageHandler, MessageResponders } from '../../lib';
import { marshalObject } from '../../lib/marshaling';
import { EventHandlingMessage, IHighlightOptions } from './interface';
import {
  RangeData,
  createRangeFromRangeData,
  createSelectorFromStringArray,
} from '../utilities/rangeData';
import { start } from 'repl';

export class Highlighter extends MessageHandler {
  public declarations: MessageResponders = {
    [EventHandlingMessage.CreateHighlight]: this._createHighlight,
    [EventHandlingMessage.DeleteHighlight]: this._deleteHighlight,
  };

  private async _createHighlight(
    callback: MessageCallback,
    rangeData: RangeData,
    options: IHighlightOptions,
  ): Promise<number> {
    const range = createRangeFromRangeData(rangeData);
    let highlightsContainer = document.getElementById('highlights');
    if (!highlightsContainer) highlightsContainer = this._createHighlightsContainer();
    const clientRects = range.getClientRects();
    const id = this._createHighlightId(rangeData);

    const el = document.getElementById(id);
    if (el) {
      return -1;
    }

    const highlight = this._createHighlightDivs(clientRects, id);
    highlightsContainer.append(highlight);

    return 1;
  }

  private async _deleteHighlight(
    callback: MessageCallback,
    rangeData: RangeData,
  ): Promise<number> {
    const id = this._createHighlightId(rangeData);
    const el = document.getElementById(id);
    if (!el) {
      return -1;
    }

    el.remove();

    return 1;
  }

  private _createHighlightId(rangeData: RangeData): string {
    const startSelector = createSelectorFromStringArray(rangeData.startContainer);
    const endSelector = createSelectorFromStringArray(rangeData.endContainer);
    let id = startSelector + rangeData.startOffset + endSelector + rangeData.endOffset;
    id = id.replace(/ /g, '');

    return id;
  }

  private _createHighlightsContainer(): HTMLElement {
    const div = document.createElement('div');
    div.setAttribute('id', 'highlights');
    div.style.setProperty('pointer-events', 'none');
    document.body.append(div);

    return div;
  }

  private _createHighlightDivs(clientRects: ClientRectList | DOMRectList, id: string)
    : HTMLDivElement {
    const divElements: HTMLDivElement[] = [];
    const container: HTMLDivElement = document.createElement('div');
    container.setAttribute('class', 'highlight');
    container.setAttribute('id', id);

    for (let i = 0; i < clientRects.length; i += 1) {
      const clientRect = clientRects[i];
      const divEl = this._createHighlightDiv(clientRect);
      divElements.push(divEl);
    }

    for (const el of divElements) {
      container.append(el);
    }
    return container;
  }

  private _createHighlightDiv(clientRect: ClientRect | DOMRect): HTMLDivElement {
    const docRect = document.body.getBoundingClientRect();
    const highlight = document.createElement('div');
    highlight.style.setProperty('position', 'absolute');
    highlight.style.setProperty('background', 'rgba(220, 255, 15, 0.40)');
    highlight.style.setProperty('width', `${clientRect.width}px`);
    highlight.style.setProperty('height', `${clientRect.height}px`);
    highlight.style.setProperty('left', `${clientRect.left - docRect.left}px`);
    highlight.style.setProperty('top', `${clientRect.top - docRect.top}px`);

    return highlight;
  }
}
