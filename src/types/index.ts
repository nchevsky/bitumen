export type {default as Comparable} from './Comparable.ts';
export * from './guards.ts';

export type AbstractConstructor<T = object> = abstract new (...args: Array<any>) => T;

export type Constructor<T = object> = new (...args: Array<any>) => T;

export type Dictionary = Record<string, unknown>;

export type ExcludeFromReturnType<F extends (...args: Array<any>) => any, UndesiredReturnType>
  = ReplaceReturnType<F, Exclude<ReturnType<F>, UndesiredReturnType>>;

export type ReplaceReturnType<
  F extends ((...args: Array<any>) => any) | jest.MockedFunction<(...args: Array<any>) => any>,
  NewReturnType
> = F extends jest.MockedFunction<(...args: Array<any>) => any>
  ? jest.MockedFunction<(...args: Parameters<F>) => NewReturnType>
  : (...args: Parameters<F>) => NewReturnType;
