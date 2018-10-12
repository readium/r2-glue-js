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
  if (eventTarget instanceof Element) {
    // Generate a CSS selector for the Element
    return finder(eventTarget);
  }
}

// tslint:disable
// Grabbed from:
//   https://gist.github.com/leofavre/d029cdda0338d878889ba73c88319295
/**
 * Returns an array with all DOM elements affected by an event.
 * The function serves as a polyfill for
 * [`Event.composedPath()`](https://dom.spec.whatwg.org/#dom-event-composedpath).
 *
 * @category Event
 * @param {Event} evt The triggered event.
 * @return {Array.<HTMLElement>} The DOM elements affected by the event.
 * 
 * @example
 * let domChild = document.createElement("div"),
 * 	domParent = document.createElement("div"),
 * 	domGrandparent = document.createElement("div"),
 * 	body = document.body,
 * 	html = document.querySelector("html");
 * 
 * domParent.appendChild(domChild);
 * domGrandparent.appendChild(domParent);
 * body.appendChild(domGrandparent);
 * 
 * domChild.addEventListener("click", dealWithClick);
 * const dealWithClick = evt => getEventPath(evt);
 *
 * // when domChild is clicked:
 * // => [domChild, domParent, domGrandparent, body, html, document, window]
 */
export function eventPath(evt: any): any[] {
  var path = (evt.composedPath && evt.composedPath()) || evt.path,
      target = evt.target;

  if (path != null) {
      // Safari doesn't include Window, and it should.
      path = (path.indexOf(window) < 0) ? path.concat([window]) : path;
      return path;
  }

  if (target === window) {
      return [window];
  }

  function getParents(node: any, memo?: any[]): any {
      memo = memo || [];
      var parentNode = node.parentNode;

      if (!parentNode) {
          return memo;
      }
      else {
          return getParents(parentNode, memo.concat([parentNode]));
      }
  }

  return [target]
      .concat(getParents(target))
      .concat([window]);
}
// tslint:enable
