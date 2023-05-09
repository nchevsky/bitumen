import {isObject} from '../types/guards.js';

/**
 * Determines whether a given value is empty* and, if so, returns a given substitute
 * as a default/fallback value; otherwise, returns the original value if non-empty.
 * 
 * (*) Depending on its type, a value is considered empty if:
 * 
 * - it's an **array** that contains no items,
 * - it's a **number** with a value of `NaN`,
 * - it's an **object** that contains no keys, or
 * - it's a **string** that is blank or contains only whitespace.
 * 
 * @param value Value to evaluate for emptiness.
 * @param substitute Default/fallback value to return if `value` is empty.
 * @returns `value` if non-empty, or `substitute` if `value` is empty.
 */
export function ifEmpty<V extends unknown>(value: V, substitute: V) {
  if (Array.isArray(value)) {
    return value.length ? value : substitute;
  } else if (typeof value == 'number') {
    return Number.isNaN(value) ? substitute : value;
  } else if (isObject(value)) {
    return Object.keys(value).length ? value : substitute;
  } else if (typeof value == 'string') {
    return value.trim() == '' ? substitute : value;
  }
  return value ?? substitute;
}
