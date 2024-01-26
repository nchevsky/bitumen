import type Comparable from '../../types/Comparable.ts';
import SortedSet from '../SortedSet.ts';

class Value implements Comparable {
  value;

  constructor(value: string) { this.value = value; }

  get [Symbol.toStringTag](): string { return `Value='${this.value}'`; }
  compareTo(another: this): number { return this.value.localeCompare(another.value); }
  equals(another: this): boolean { return this.value == another.value; }
}

describe('collections/SortedSet', () => {
  const makeSet = <V extends Value | number | string>(values?: Iterable<V>) => new class extends SortedSet<V> {
    getValues() { return this.elements.map((element) => typeof element == 'object' ? element.value : element); }
  }(values);

  test('[Symbol.iterator]()', () => {
    const value = new Value('foo');
    const iterator = makeSet([value])[Symbol.iterator]();
    expect(iterator.next().value).toBe(value);
    expect(iterator.next().done).toBeTruthy();
  });

  test('[Symbol.toStringTag]()', () => {
    const value1 = new Value('bar');
    const value2 = new Value('foo');
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    expect(`${makeSet([value1, value2])}`).toBe(`[object SortedSet=[${value1}, ${value2}]]`);
  });

  describe('add()', () => {
    describe('adds each unique value only once', () => {
      test('objects', () => {
        const value = new Value('foo');
        expect(makeSet().add(value).add(value).getValues()).toEqual(['foo']);
      });

      test('primitives', () =>
        expect(makeSet().add(123).add(123).getValues()).toEqual([123]));
    });

    describe('adds values in the right order', () => {
      test('numbers', () => expect(
        makeSet().add(2).add(4).add(3).add(1).getValues()
      ).toEqual([1, 2, 3, 4]));

      test('objects', () => expect(
        makeSet().add(new Value('baz')).add(new Value('qux')).add(new Value('foo')).add(new Value('bar')).getValues()
      ).toEqual(['bar', 'baz', 'foo', 'qux']));

      test('strings', () => expect(
        makeSet().add('baz').add('qux').add('foo').add('bar').getValues()
      ).toEqual(['bar', 'baz', 'foo', 'qux']));
    });
  });

  test('clear()', () => {
    const set = makeSet([new Value('foo')]);
    set.clear();
    expect(set.getValues()).toEqual([]);
  });

  test('constructor()', () => expect(makeSet([new Value('foo')]).getValues()).toEqual(['foo']));

  describe('delete()', () => {
    test('does nothing and returns false when the given value is not in the set', () => {
      const set = makeSet([new Value('foo')]);
      expect(set.delete(new Value('bar'))).toBe(false);
      expect(set.getValues()).toEqual(['foo']);
    });

    test('deletes the given value and returns true when the given value is in the set', () => {
      const value = new Value('foo');
      const set = makeSet([value]);
      expect(set.delete(value)).toBe(true);
      expect(set.getValues()).toEqual([]);
    });
  });

  test('entries()', () => {
    const value = new Value('foo');
    expect(Array.from(makeSet([value]).entries())).toEqual([[value, value]]);
  });

  test('keys()', () => {
    const value = new Value('foo');
    expect(Array.from(makeSet([value]).keys())).toEqual([value]);
  });

  test('forEach()', () => {
    const value = new Value('foo');
    const set = makeSet([value]);
    set.forEach((_key, _value, _set) => {
      expect(_key).toBe(value);
      expect(_value).toBe(value);
      expect(_set).toBe(set);
    });
  });

  describe('has()', () => {
    test('returns true when the given value is in the set', () => {
      const value = new Value('foo');
      expect(makeSet([value]).has(value)).toBe(true);
    });

    test('returns false when the given value is not in the set', () =>
      expect(makeSet().has(new Value('foo'))).toBe(false));
  });

  test('size', () => expect(makeSet([new Value('foo')]).size).toBe(1));

  test('values()', () => {
    const value = new Value('foo');
    expect(Array.from(makeSet([value]).values())).toEqual([value]);
  });
});
