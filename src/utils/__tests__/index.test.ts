import {clone, ifEmpty, nestInto} from '../index.ts';

test('utils/clone()', () => {
  class Foo {
    get negativeValue() { return -this.originalValue; }
    readonly originalValue: number;

    constructor(value: number) {
      this.originalValue = value;
    }
  }

  const twin = clone(new Foo(1), {newProperty: {value: 'foo'}, originalValue: {value: 2}});
  expect(twin.negativeValue).toEqual(-2); // preserves getter
  expect('newProperty' in twin).toBeTruthy(); // adds new property
  if ('newProperty' in twin) expect(twin.newProperty).toEqual('foo');
  expect(twin.originalValue).toEqual(2); // overwrites original value
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
