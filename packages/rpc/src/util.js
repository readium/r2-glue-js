import finder from '@medv/finder';
// tslint:disable
/**
 * Returns a random v4 UUID
 * See {@link https://gist.github.com/jed/982883}.
 * @param [a] This is to not be used.
 * @returns {string}
 */
export function uuid(a) {
    if (a === void 0) { a = undefined; }
    return a
        ? (a ^ ((Math.random() * 16) >> (a / 4))).toString(16)
        : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, uuid);
}
// tslint:enable
export function isEventTarget(input) {
    return !!(input.addEventListener && input.removeEventListener && input.dispatchEvent);
}
export function resolveEventTargetSelector(selector) {
    if (selector === '@window') {
        return [window];
    }
    if (selector === '@document') {
        return [document];
    }
    return Array.from(document.querySelectorAll(selector));
}
export function generateEventTargetSelector(eventTarget) {
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
//# sourceMappingURL=util.js.map