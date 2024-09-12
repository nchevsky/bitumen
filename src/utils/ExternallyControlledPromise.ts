type Executor<T> = ConstructorParameters<typeof Promise<T>>[0];
type Rejecter<T> = Parameters<Executor<T>>[1];
type Resolver<T> = Parameters<Executor<T>>[0];

/**
 * Implementation of `Promise` that can be externally resolved or rejected on demand via the
 * `reject()` or `resolve()` instance methods.
 * 
 * @deprecated Use `Promise.withResolvers()` instead.
 */
export default class ExternallyControlledPromise<T> extends Promise<T> {
  #reject: Rejecter<T>;
  #resolve: Resolver<T>;

  /**
   * Rejects the promise with the given reason.
   * 
   * @returns The settled promise.
   */
  reject(reason?: Parameters<Rejecter<T>>[0]) {
    this.#reject(reason); // eslint-disable-line @typescript-eslint/prefer-promise-reject-errors
    return this;
  }

  /**
   * Resolves the promise with the given value.
   * 
   * @returns The settled promise.
   */
  resolve(value: Parameters<Resolver<T>>[0]) {
    this.#resolve(value);
    return this;
  }

  /**
   * Creates a promise that can be externally resolved or rejected via the `reject()` or `resolve()` methods.
   * 
   * @deprecated Use `Promise.withResolvers()` instead.
   * @param executor ⛔ **Must be omitted in order for the promise to be externally controllable.**
   *                 The JavaScript runtime requires that promise constructors declare this argument. If
   *                 supplied, the instance will behave like a standard promise and be driven exclusively
   *                 by the given callback instead of the `reject()` and `resolve()` methods.
   */
  constructor(executor?: Executor<T>) {
    const fail = () => {
      throw new Error('This promise cannot be settled externally because it was created with an executor.');
    };
    let rejectExternally: Rejecter<T> = fail;
    let resolveExternally: Resolver<T> = fail;

    super(executor ?? ((resolve, reject) => {
      // intermediate variables are needed because `this` may not be accessed from `super()`
      rejectExternally = reject;
      resolveExternally = resolve;
    }));

    this.#reject = rejectExternally;
    this.#resolve = resolveExternally;
  }
}
