/**
 * Returns a random v4 UUID
 * See {@link https://gist.github.com/jed/982883}.
 * @param [a] This is to not be used.
 * @returns {string}
 */
export declare function uuid(a?: any): string;
export declare function isEventTarget(input: any): boolean;
export declare function resolveEventTargetSelector(selector: string): EventTarget[];
export declare function generateEventTargetSelector(eventTarget: EventTarget): string | undefined;
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
export declare function eventPath(evt: any): any[];
