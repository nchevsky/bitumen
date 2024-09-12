import {describe, expect, test} from 'vitest';

import type {AbstractConstructor} from '../../types/index.ts';
import {named} from '../index.ts';

describe('mixins/named', () => {
  const make = (name: string, superclass: AbstractConstructor = class {}) => new class extends named(superclass) {
    constructor(name: string) {
      super();
      this.name = name;
    }
  }(name);

  describe('compareTo()', () => {
    test('returns a negative number when the first name comes before the second', () =>
      expect(make('a').compareTo(make('b')) < 0).toBeTruthy());

    test('returns zero when the names are equivalent', () => expect(make('a').compareTo(make('á'))).toBe(0));

    test('returns a positive number when the first name comes after the second', () =>
      expect(make('b').compareTo(make('a')) > 0).toBeTruthy());
  });

  describe('equals()', () => {
    test('returns true when the names are equivalent', () => expect(make('a').equals(make('á'))).toBeTruthy());

    test('returns false when the names differ', () => expect(make('a').equals(make('b'))).toBeFalsy());

    test('defers to the original implementation if the superclass has one', () =>
      expect(make('ignored', class { equals() { return 123; } }).equals(make('ignored'))).toBe(123));
  });
});
