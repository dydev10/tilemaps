/**
 * Checks if given value is empty.
 * Returns true for [null, undefined, strings, object, array].
 * 
 * 0 is NOT considered as empty value, to work with values that can be a number or empty.
 * Always use this helper when check if value is null or number
 * 
 * @param {T} value
 * @returns {boolean}
 */
export default function isEmpty<T>(value: T): boolean {
  return value === undefined || value === null
    || (typeof value === 'object' && Object.keys(value).length === 0)
    || (typeof value === 'string' && value.trim().length === 0);
}
