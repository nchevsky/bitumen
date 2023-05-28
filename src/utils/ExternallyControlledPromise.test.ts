import ExternallyControlledPromise from './ExternallyControlledPromise.js';

describe('utils/ExternallyControlledPromise', () => {
  test('can be settled externally when created without an executor', () => {
    expect(new ExternallyControlledPromise().reject('foo')).rejects.toEqual('foo');
    expect(new ExternallyControlledPromise().resolve('foo')).resolves.toEqual('foo');
  });

  test('behaves like a standard promise when created with an executor', () => {
    const promise = new ExternallyControlledPromise((resolve) => resolve('foo'));

    expect(() => { promise.reject(); }).toThrow(); // not externally controllable
    expect(() => { promise.resolve(''); }).toThrow(); // not externally controllable
    expect(promise).resolves.toEqual('foo');
  });
});
