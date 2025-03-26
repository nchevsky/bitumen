export type {default as Comparable} from './Comparable.ts';
export * from './guards.ts';

export type AbstractConstructor<T = object> = abstract new (...args: Array<any>) => T;

export type Constructor<T = object> = new (...args: Array<any>) => T;

export type Dictionary = Record<PropertyKey, unknown>;

export type ExcludeFromReturnType<F extends (...args: Array<any>) => any, UndesiredReturnType>
  = ReplaceReturnType<F, Exclude<ReturnType<F>, UndesiredReturnType>>;

export type KeysOfObjectUnion<U> = U extends object ? keyof U : never;

export type PickAsOptional<O extends object, K extends keyof O> = {[Key in K]+?: O[Key]};

export type PickAsRequired<O extends object, K extends keyof O> = {[Key in K]-?: O[Key]};

export type ReplaceReturnType<F extends ((...args: Array<any>) => any), NewReturnType>
  = (...args: Parameters<F>) => NewReturnType;

export type ValuesOfObjectUnion<U> = U extends object ? U[keyof U] : never;
