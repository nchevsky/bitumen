import type Comparable from './Comparable.js';

export function isComparable(value: unknown): value is Comparable {
  return isObject(value) && ('compareTo' in value || 'equals' in value);
}

export function isObject(value: unknown): value is Object {
  return typeof value == 'object' && value !== null && !Array.isArray(value);
}
