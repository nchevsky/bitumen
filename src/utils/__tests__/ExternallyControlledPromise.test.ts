import ExternallyControlledPromise from '../ExternallyControlledPromise.ts';

describe('utils/ExternallyControlledPromise', () => {
  test('can be settled externally when created without an executor', async () => {
    await expect(new ExternallyControlledPromise().reject(new Error('❌'))).rejects.toThrow('❌');
    await expect(new ExternallyControlledPromise().resolve('✔️')).resolves.toEqual('✔️');
  });

  test('behaves like a standard promise when created with an executor', async () => {
    const promise = new ExternallyControlledPromise((resolve) => resolve('✔️'));

    expect(() => { void promise.reject(new Error()); }).toThrow(/cannot be settled externally/);
    expect(() => { void promise.resolve(''); }).toThrow(/cannot be settled externally/);
    await expect(promise).resolves.toEqual('✔️');
  });
});
