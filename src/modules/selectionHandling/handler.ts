import { MessageCallback } from '../../lib';
import { IAddEventListenerOptions } from '../eventHandling/interface';
import { RangeData } from './interface';
import { marshalObject } from '../../lib/marshaling';
import { EventHandler } from '../eventHandling/handler';

export class SelectionHandler extends EventHandler {

  protected createHandler(
    callback: MessageCallback,
    properties: string[],
    options: IAddEventListenerOptions,
    ): EventListener {
    return (event) => {
      event.preventDefault();

      if (options.stopPropagation) {
        event.stopPropagation();
      }
      if (options.stopImmediatePropagation) {
        event.stopImmediatePropagation();
      }

      const selection = window.getSelection();
      const text = selection.toString();
      if (!text) return;

      const range = this._createRangeFromSelection(selection);
      selection.removeAllRanges();
      selection.addRange(range);

      const rangeData = this._createRangeData(range);

      const obj = { text, rangeData };
      const ret = marshalObject(obj);

      callback(ret);
    };
  }

  private _createRangeData(range: Range): RangeData {
    // Ensure we don't use the Text node, so that it can be properly stringified later on
    const startContainer = range.startContainer instanceof Text ?
      range.startContainer.parentElement : range.startContainer;

    const endContainer = range.endContainer instanceof Text ?
      range.endContainer.parentElement : range.endContainer;

    const startContainerPath = this._getElementPath(startContainer);
    const endContainerPath = this._getElementPath(endContainer);

    const rangeData: RangeData = {
      startOffset: range.startOffset,
      startContainer: startContainerPath,
      endOffset: range.endOffset,
      endContainer: endContainerPath,
    };

    return rangeData;
  }

  private _createRangeFromSelection(selection: Selection): Range {
    return this._createRange(
      selection.anchorNode, selection.anchorOffset,
      selection.focusNode, selection.focusOffset,
    );
  }

  private _createRangeFromRangeData(rangeData: RangeData): Range {
    const startSelector = this._createSelectorFromStringArray(rangeData.startContainer);
    const endSelector = this._createSelectorFromStringArray(rangeData.endContainer);

    let startContainer: any = document.querySelector(startSelector);
    let endContainer: any = document.querySelector(endSelector);

    if (!startContainer || !endContainer) {
      console.error('Element was not successfully retrieved with selector');

      return new Range();
    }

    startContainer = this._getTextNode(startContainer);
    endContainer = this._getTextNode(endContainer);

    return this._createRange(
      startContainer, rangeData.startOffset,
      endContainer, rangeData.endOffset,
    );
  }

  private _createSelectorFromStringArray(array: string[]): string {
    let selector: string = '';

    let value = '';
    for (let i = array.length - 1; i >= 0; i -= 1) {
      value = array[i];
      // Ignore custom selectors, such as @window and @document
      if (value.includes('@')) continue;

      if (selector.length !== 0) selector += ' ';
      selector += value;
    }

    return selector;
  }

  private _createRange(
    startContainer: Node,
    startOffset: number,
    endContainer: Node,
    endOffset: number,
  ): Range {
    const range = new Range();

    range.setStart(startContainer, startOffset);
    range.setEnd(endContainer, endOffset);

    return range;
  }

  private _getTextNode(element: Element | Node): Node | undefined {
    const nodes: NodeListOf<ChildNode> = element.childNodes;

    let node: Node;
    let textNode: Node | undefined = undefined;
    for (let i = 0; i < nodes.length; i += 1) {
      node = nodes[i];
      if (node.nodeType === Node.TEXT_NODE) {
        textNode = node;
        break;
      }
    }

    return textNode;
  }

  private _getElementPath(element: any, elements?: any[]): any[] {
    let els = elements;
    if (!els) {
      els = [];
    }
    els.push(element);

    const parentEl = element.parentElement;
    // If a parent element exists, run this method again with that parent element
    // Otherwise, return the elements with document and window appended to it
    return parentEl ? this._getElementPath(parentEl, els) : this._addDocumentAndWindowToPath(els);
  }

  private _addDocumentAndWindowToPath(elements: any[]): any[] {
    elements.push(document);
    elements.push(window);

    return elements;
  }
}
