import finder from '@medv/finder';

// tslint:disable
/**
 * Returns a random v4 UUID
 * See {@link https://gist.github.com/jed/982883}.
 * @param [a] This is to not be used.
 * @returns {string}
 */
export function uuid(a: any = undefined): string {
  return a
    ? (a ^ ((Math.random() * 16) >> (a / 4))).toString(16)
    : (([1e7] as any) + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, uuid);
}
// tslint:enable

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
