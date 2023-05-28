import {ifEmpty} from '../index.js';

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
