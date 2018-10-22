export interface RangeData {
    startOffset: number;
    startContainer: any[];
    endOffset: number;
    endContainer: any[];
}

export function createRangeData(range: Range): RangeData {
  // Ensure we don't use the Text node, so that it can be properly stringified later on
  const startContainer = range.startContainer instanceof Text ?
    range.startContainer.parentElement : range.startContainer;

  const endContainer = range.endContainer instanceof Text ?
    range.endContainer.parentElement : range.endContainer;

  const startContainerPath = getElementPath(startContainer);
  const endContainerPath = getElementPath(endContainer);

  const rangeData: RangeData = {
    startOffset: range.startOffset,
    startContainer: startContainerPath,
    endOffset: range.endOffset,
    endContainer: endContainerPath,
  };

  return rangeData;
}

export function createRangeFromSelection(selection: Selection): Range {
  return createRange(
    selection.anchorNode, selection.anchorOffset,
    selection.focusNode, selection.focusOffset,
  );
}

export function createRangeFromRangeData(rangeData: RangeData): Range {
  const startSelector = createSelectorFromStringArray(rangeData.startContainer);
  const endSelector = createSelectorFromStringArray(rangeData.endContainer);

  let startContainer: any = document.querySelector(startSelector);
  let endContainer: any = document.querySelector(endSelector);

  if (!startContainer || !endContainer) {
    console.error('Element was not successfully retrieved with selector');

    return new Range();
  }

  startContainer = getTextNode(startContainer);
  endContainer = getTextNode(endContainer);

  return createRange(
    startContainer, rangeData.startOffset,
    endContainer, rangeData.endOffset,
  );
}

function createSelectorFromStringArray(array: string[]): string {
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

function createRange(
  startContainer: Node,
  startOffset: number,
  endContainer: Node,
  endOffset: number,
): Range {
  const range = new Range();

  const position = startContainer.compareDocumentPosition(endContainer);
  let isBackwards = false;
  if (position === 0) {
    isBackwards = startOffset > endOffset;
  }
  if (position === startContainer.DOCUMENT_POSITION_PRECEDING) {
    isBackwards = true;
  }

  const sc = isBackwards ? endContainer : startContainer;
  const so = isBackwards ? endOffset : startOffset;
  const ec = isBackwards ? startContainer : endContainer;
  const eo = isBackwards ? startOffset : endOffset;

  range.setStart(sc, so);
  range.setEnd(ec, eo);

  return range;
}

function getTextNode(element: Element | Node): Node | undefined {
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

function getElementPath(element: any, elements?: any[]): any[] {
  let els = elements;
  if (!els) {
    els = [];
  }
  els.push(element);

  const parentEl = element.parentElement;
  // If a parent element exists, run this method again with that parent element
  // Otherwise, return the elements with document and window appended to it
  return parentEl ? getElementPath(parentEl, els) : addDocumentAndWindowToPath(els);
}

function addDocumentAndWindowToPath(elements: any[]): any[] {
  elements.push(document);
  elements.push(window);

  return elements;
}
