import {isObject} from '../types/guards.ts';
import type {Dictionary} from '../types/index.ts';

type Clone<O, PD> = Omit<O, keyof PD> & {
  [K in keyof PD]: PD[K] extends {get: () => infer V}
    ? V
    : PD[K] extends {set: (value: infer V) => void}
      ? V
      : PD[K] extends {value: infer V} ? V : undefined
};

type PropertyDescriptors<O extends object> = {[key in keyof O]?: PropertyDescriptor};

export {default as ExternallyControlledPromise} from './ExternallyControlledPromise.ts';

/**
 * Clones a given object based on its prototype, optionally injecting new and/or modifying existing
 * properties. Unlike object spreading (`...`) and `Object.assign()`, clones produced by this function
 * retain getters, setters, and other special members.
 * 
 * @param object Object to be cloned.
 * @param propertyDescriptors An object—or a function that returns an object—containing new properties
 *                            to be added and/or existing properties to be overwritten. If a function is
 *                            given, it receives as an argument a reference to `object`.
 */
export function clone<O extends object>(object: O): O;
export function clone<O extends object, PD = PropertyDescriptors<O>>(
  object: O, propertyDescriptors: PD & PropertyDescriptorMap
): Clone<O, PD>;
export function clone<O extends object, PD = PropertyDescriptors<O>>(
  // eslint-disable-next-line @typescript-eslint/unified-signatures -- combining signatures breaks typings
  object: O, propertyDescriptors: (object: O) => PD & PropertyDescriptorMap
): Clone<O, PD>;
export function clone<O extends object, PD = PropertyDescriptors<O>>(
  object: O,
  propertyDescriptors?: (PD & PropertyDescriptorMap) | ((object: O) => PD & PropertyDescriptorMap)
): Clone<O, PD> {
  return Object.create(object, { // eslint-disable-line @typescript-eslint/no-unsafe-return
    ...Object.getOwnPropertyDescriptors(object),
    ...typeof propertyDescriptors == 'function' ? propertyDescriptors(object) : propertyDescriptors
  });
}

/**
 * Escapes special characters in a given string for safe use in a regular expression.
 * 
 * @param string String containing RegExp-unsafe characters (e.g. _'foo (bar)'_).
 * @returns RegExp-safe string (e.g. _'foo \\(bar\\)'_).
 */
export function escapeForRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

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
export function ifEmpty<V>(value: V, substitute: V) {
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

/**
 * Nests a given sequence of keys into an object in ascending order of depth, setting the last key
 * to the trailing value. If called multiple times with the same key sequence and different values,
 * the last key becomes an array of the values provided across all invocations.
 * 
 * ### Different keys
 * ```js
 * const object = {};
 * nestInto(object, 'foo', 'bar', 123);
 * nestInto(object, 'foo', 'baz', 456);
 * console.log(object); // {foo: {bar: 123, baz: 456}}
 * ```
 * 
 * ### Same keys
 * ```js
 * const object = {};
 * nestInto(object, 'foo', 'bar', 123);
 * nestInto(object, 'foo', 'bar', 456);
 * console.log(object); // `{foo: {bar: [123, 456]}}`
 * ```
 * 
 * @param object - Object into which to nest `keysAndValue`.
 * @param keysAndValue - Keys to nest into `object` in ascending order of depth, and a trailing value to which
 *                       to set the last key. If the key sequence already exists in `object`, the existing value
 *                       is converted to an array and the new value appended to it, and any further calls made
 *                       with the same key sequence continue to append values to the array.
 * @returns Reference to `object`.
 */
export function nestInto(object: Dictionary, ...keysAndValue: [...Array<number | string>, unknown]) {
  let path = object;
  for (let i = 0; i < keysAndValue.length - 1; i++) {
    const key = keysAndValue[i] as string;
    // if this is the second-to-last key
    if (i == keysAndValue.length - 2) {
      if (path[key] === undefined) {
        // if the key does not already exist, create it and set it to the trailing value
        path[key] = keysAndValue[i + 1];
      } else {
        // if the key already exists and its value...
        // - is not yet an array, convert it to an array and append the new value to it
        // - is already an array, append the new value to it
        const value = path[key];
        (Array.isArray(value) ? value : path[key] = [value]).push(keysAndValue[i + 1]);
      }
    }
    // if we have not yet hit the second-to-last key, advance to the next
    path = path[key] as Dictionary | undefined ?? (path[key] = {});
  }
  return object;
}

/**
 * Fully typed implementation of `Object.entries()` with literal key inference.
 * 
 * @param object Object whose key-value pairs are desired (e.g. `{bar: 123, foo: 456}`).
 * @returns Array of key-value pairs (e.g. `[['bar', 123], ['foo', 456]]`).
 */
export function objectEntries<O extends object>(object: O) {
  return Object.entries(object) as Array<[keyof O, O[keyof O]]>;
}

/**
 * Fully typed implementation of `Object.keys()` with literal key inference.
 * 
 * @param object Object whose keys are desired (e.g. `{bar: 123, foo: 456}`).
 * @returns Array of keys (e.g. `['bar', 'foo']`).
 */
export function objectKeys<O extends object>(object: O) {
  return Object.keys(object) as Array<keyof O>;
}

/**
 * Removes unwanted keys from a given object.
 * 
 * @param object Object with unwanted keys (e.g. `{bar: 123, foo: 456}`).
 * @param keys Names of keys to remove (e.g. _'bar'_).
 * @returns A copy of the object without the unwanted keys (e.g. `{foo: 456}`).
 */
export function omit<O extends object, K extends keyof O>(object: O, ...keys: Array<K>) {
  return Object.fromEntries(objectEntries(object).filter(([key, value]) => !keys.includes(key as K))) as Omit<O, K>;
}
