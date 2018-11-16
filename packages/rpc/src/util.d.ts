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
