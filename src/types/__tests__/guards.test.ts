import {describe, expect, test} from 'vitest';

import {isComparable, isObject} from '../index.ts';

describe('types/guards', () => {
  describe('isComparable()', () => {
    test('returns true when value is an object with compareTo() or equals()', () =>
      expect(isComparable({equals: () => false})).toBeTruthy());

    test('returns false when value lacks compareTo() and equals()', () => expect(isComparable({})).toBeFalsy());

    test('returns false when value is not an object', () => expect(isComparable('')).toBeFalsy());
  });

  describe('isObject()', () => {
    test('returns true when value is a proper object', () => expect(isObject({})).toBeTruthy());
    test('returns false when value is an array', () => expect(isComparable([])).toBeFalsy());
    test('returns false when value is null', () => expect(isComparable(null)).toBeFalsy());
  });
});
