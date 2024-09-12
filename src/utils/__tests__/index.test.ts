import {describe, expect, test, vi} from 'vitest';

import {clone, ifEmpty, nestInto} from '../index.ts';

describe('utils/clone()', () => {
  class Subject {
    get negatingGetter() { return -this.value; }
    set negatingSetter(value: typeof this.value) { this.value = -value; }
    value = 1;
  }

  test('can add a new property without affecting existing ones', () => {
    const twin = clone(new Subject(), {newProperty: {value: 'foo'}});

    expect<string>(twin.newProperty).toEqual('foo'); // new
    expect<number>(twin.value).toEqual(1); // existing
  });

  test('can modify an existing property without affecting the rest', () => {
    const twin = clone(new Subject(), {value: {get: () => '2'}});

    expect<number>(twin.negatingGetter).toEqual(-2); // unaffected
    expect<string>(twin.value).toEqual('2'); // modified
  });

  test('keeps all properties the same when called with no `propertyDescriptors`', () => {
    const twin = clone(new Subject());

    expect<number>(twin.negatingGetter).toEqual(-1);
    twin.negatingSetter = 2;
    expect<number>(twin.value).toEqual(-2);
  });

  test('passes the object being cloned to the `propertyDescriptors` callback', () => {
    const propertyDescriptors = {foo: {value: 'bar'}};
    const propertyDescriptorsCallback = vi.fn(() => propertyDescriptors);
    const subject = new Subject();

    vi.spyOn(Object, 'create');
    clone(subject, propertyDescriptorsCallback);

    expect(Object.create).toHaveBeenCalledWith(expect.any(Object), expect.objectContaining(propertyDescriptors));
    expect(propertyDescriptorsCallback).toHaveBeenCalledWith(subject);
  });
});

describe('utils/ifEmpty()', () => {
  test('array is empty if it contains no items', () => {
    expect(ifEmpty([], ['foo'])).toEqual(['foo']);
    expect(ifEmpty(['foo'], [])).toEqual(['foo']);
  });

  test('number is empty if `NaN`', () => {
    expect(ifEmpty(NaN, 0)).toEqual(0);
    expect(ifEmpty(0, NaN)).toEqual(0);
  });

  test('object is empty if it has no keys', () => {
    expect(ifEmpty({}, {foo: 'bar'})).toEqual({foo: 'bar'});
    expect(ifEmpty({foo: 'bar'}, {})).toEqual({foo: 'bar'});
  });

  test('string is empty if it\'s blank or contains only whitespace', () => {
    expect(ifEmpty('  ', 'foo')).toEqual('foo');
    expect(ifEmpty('foo', '  ')).toEqual('foo');
  });

  test('`false` is not considered empty', () => expect(ifEmpty(false, true)).toBe(false));

  test('`null` and `undefined` are considered empty', () => {
    expect(ifEmpty(null, 'empty')).toBe('empty');
    expect(ifEmpty(undefined, 'empty')).toBe('empty');
  });
});

describe('utils/nestInto()', () => {
  test('with different paths', () => {
    const object = {};
    nestInto(object, 'foo', 'bar', 123);
    nestInto(object, 'foo', 'baz', 456);
    expect(object).toEqual({foo: {bar: 123, baz: 456}});
  });

  test('with the same path and different values', () => {
    const object = {};
    nestInto(object, 'foo', 'bar', 123);
    nestInto(object, 'foo', 'bar', 456);
    nestInto(object, 'foo', 'bar', 789);
    expect(object).toEqual({foo: {bar: [123, 456, 789]}});
  });
});
