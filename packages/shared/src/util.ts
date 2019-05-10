import finder from '@medv/finder';

export function isEventTarget(input: any): boolean {
  return !!(input.addEventListener && input.removeEventListener && input.dispatchEvent);
}

export function resolveEventTargetSelector(selector: string): EventTarget[] {
  if (selector === '@window') {
    return [window];
  }
  if (selector === '@document') {
    return [document];
  }
  return Array.from(document.querySelectorAll(selector));
}

export function generateEventTargetSelector(eventTarget: EventTarget): string | undefined {
  if (eventTarget === window) {
    return '@window';
  }
  if (eventTarget === document) {
    return '@document';
  }
  const node = eventTarget as Node;
  if (node.nodeType === Node.ELEMENT_NODE) {
    // Generate a CSS selector for the Element
    return finder(<Element>eventTarget);
  }
}
