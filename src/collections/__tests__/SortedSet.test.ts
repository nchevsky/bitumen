import {describe, expect, test} from 'vitest';

import type Comparable from '../../types/Comparable.ts';
import SortedSet from '../SortedSet.ts';

class Element implements Comparable {
  value;

  constructor(value: string) { this.value = value; }

  compareTo(another: this): number { return this.value.localeCompare(another.value); }
  equals(another: this): boolean { return this.value == another.value; }
}

describe('collections/SortedSet', () => {
  test('[Symbol.iterator]()', () => {
    expect.assertions(1);
    for (const entry of new SortedSet(['foo'])) expect(entry).toEqual('foo');
  });

  test('[Symbol.toStringTag]()', () => // eslint-disable-next-line @typescript-eslint/no-base-to-string
    expect(`${new SortedSet(['bar', 'foo'])}`).toEqual('[object SortedSet=[bar, foo]]'));

  describe('add()', () => {
    describe('inserts each unique value no more than once', () => {
      test('numbers', () => expect(Array.from(new SortedSet().add(1).add(1))).toEqual([1]));

      test('strings', () => expect(Array.from(new SortedSet().add('foo').add('foo'))).toEqual(['foo']));

      test('objects', () => {
        const element = new Element('foo');
        expect(Array.from(new SortedSet().add(element).add(element))).toMatchObject([{value: 'foo'}]);
      });
    });

    describe('inserts values in the right order', () => {
      test('numbers', () => expect(Array.from(new SortedSet().add(3).add(1).add(2))).toEqual([1, 2, 3]));

      test('objects', () =>
        expect(Array.from(new SortedSet().add(new Element('qux')).add(new Element('bar')).add(new Element('foo'))))
          .toMatchObject([{value: 'bar'}, {value: 'foo'}, {value: 'qux'}]));

      test('strings', () =>
        expect(Array.from(new SortedSet().add('qux').add('bar').add('foo'))).toEqual(['bar', 'foo', 'qux']));
    });
  });

  test('clear()', () => {
    const set = new SortedSet(['bar', 'foo']);

    expect(Array.from(set)).toEqual(['bar', 'foo']);
    set.clear();
    expect(Array.from(set)).toEqual([]);
  });

  test('constructor()', () => expect(Array.from(new SortedSet(['foo']))).toEqual(['foo']));

  describe('delete()', () => {
    test('removes the given value and returns `true` when the given value is in the set', () => {
      const set = new SortedSet(['foo']);

      expect(set.delete('foo')).toEqual(true);
      expect(Array.from(set)).toEqual([]);
    });

    test('does nothing and returns `false` when the given value isn\'t in the set', () => {
      const set = new SortedSet<string>(['foo']);

      expect(set.delete('bar')).toEqual(false);
      expect(Array.from(set)).toEqual(['foo']);
    });
  });

  test('difference() returns elements in A not in B', () =>
    expect(Array.from(new SortedSet<string>(['bar', 'baz', 'foo']).difference(new SortedSet<string>(['bar', 'baz']))))
      .toEqual(['foo']));

  test('entries()', () => expect(Array.from(new SortedSet(['foo']).entries())).toEqual([['foo', 'foo']]));

  test('intersection() returns elements in both A and B', () => {
    // A larger than B
    expect(Array.from(new SortedSet<string>(['bar', 'baz', 'foo']).intersection(new SortedSet(['foo', 'qux']))))
      .toEqual(['foo']);
    // B larger than A
    expect(Array.from(new SortedSet<string>(['bar', 'foo']).intersection(new SortedSet(['baz', 'foo', 'qux']))))
      .toEqual(['foo']);
  });

  describe('isDisjointFrom()', () => {
    test('returns `false` when A and B have elements in common', () => {
      // A larger than B
      expect(new SortedSet<string>(['bar', 'baz', 'foo']).isDisjointFrom(new SortedSet(['foo', 'qux']))).toEqual(false);
      // B larger than A
      expect(new SortedSet<string>(['bar', 'baz']).isDisjointFrom(new SortedSet(['baz', 'foo', 'qux']))).toEqual(false);
    });

    test('returns `true` when A and B don\'t have elements in common', () => {
      // A larger than B
      expect(new SortedSet<string>(['bar', 'baz', 'foo']).isDisjointFrom(new SortedSet(['qux']))).toEqual(true);
      // B larger than A
      expect(new SortedSet<string>(['bar']).isDisjointFrom(new SortedSet(['baz', 'foo', 'qux']))).toEqual(true);
    });
  });

  describe('isSubsetOf()', () => {
    test('returns `false` when B doesn\'t contain all elements in A', () => {
      // A larger than B
      expect(new SortedSet<string>(['bar', 'baz', 'foo']).isSubsetOf(new SortedSet(['bar', 'baz']))).toEqual(false);
      // B larger than A
      expect(new SortedSet<string>(['bar', 'baz']).isSubsetOf(new SortedSet(['baz', 'foo', 'qux']))).toEqual(false);
    });

    test('returns `true` when B contains all elements in A', () =>
      expect(new SortedSet<string>(['bar', 'baz']).isSubsetOf(new SortedSet(['bar', 'baz', 'foo']))).toEqual(true));
  });

  describe('isSupersetOf()', () => {
    test('returns `false` when A doesn\'t contain all elements in B', () => {
      // A larger than B
      expect(new SortedSet<string>(['bar', 'baz', 'foo']).isSupersetOf(new SortedSet(['foo', 'qux']))).toEqual(false);
      // B larger than A
      expect(new SortedSet<string>(['bar', 'baz']).isSupersetOf(new SortedSet(['bar', 'baz', 'foo']))).toEqual(false);
    });

    test('returns `true` when A contains all elements in B', () =>
      expect(new SortedSet<string>(['bar', 'baz', 'foo']).isSupersetOf(new SortedSet(['baz', 'foo']))).toEqual(true));
  });

  test('keys()', () => expect(Array.from(new SortedSet(['foo']).keys())).toEqual(['foo']));

  test('forEach()', () => {
    expect.assertions(3);

    const set = new SortedSet(['foo']);
    set.forEach((value, key, _set) => {
      expect(key).toEqual('foo');
      expect(value).toEqual('foo');
      expect(_set).toBe(set);
    });
  });

  describe('has()', () => {
    test('returns `false` when the given value isn\'t in the set', () =>
      expect(new SortedSet().has('foo')).toEqual(false));

    test('returns `true` when the given value is in the set', () =>
      expect(new SortedSet(['foo']).has('foo')).toEqual(true));
  });

  test('size', () => expect(new SortedSet(['bar', 'foo']).size).toEqual(2));

  test('symmetricDifference() returns elements in A not in B + elements in B not in A', () =>
    expect(Array.from(new SortedSet<string>(['bar', 'foo']).symmetricDifference(new SortedSet(['foo', 'qux']))))
      .toEqual(['bar', 'qux']));

  test('union() returns all elements in both A and B', () =>
    expect(Array.from(new SortedSet<string>(['bar', 'baz']).union(new SortedSet(['foo', 'qux']))))
      .toEqual(['bar', 'baz', 'foo', 'qux']));

  test('values()', () => expect(Array.from(new SortedSet(['foo']).values())).toEqual(['foo']));
});
