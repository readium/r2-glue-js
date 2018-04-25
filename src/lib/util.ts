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
    : ([1e7] as any + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, uuid);
}
// tslint:enable
