export type {default as Comparable} from './Comparable.js';
export * from './guards.js';

export type Constructor<T = {}> = abstract new (...args: Array<any>) => T;

export type Dictionary = Record<string, unknown>;

export type ExcludeFromReturnType<Function extends (...args: Array<any>) => any, UndesiredReturnType>
  = ReplaceReturnType<Function, Exclude<ReturnType<Function>, UndesiredReturnType>>;

export type ReplaceReturnType<
  Function extends (...args: Array<any>) => any | jest.MockedFunction<(...args: Array<any>) => any>, NewReturnType
> = Function extends jest.MockedFunction<(...args: Array<any>) => any>
  ? jest.MockedFunction<(...args: Parameters<Function>) => NewReturnType>
  : (...args: Parameters<Function>) => NewReturnType;
