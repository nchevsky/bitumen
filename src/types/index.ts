export type {default as Comparable} from './Comparable.js';
export * from './guards.js';

export type Constructor<T = {}> = abstract new (...args: Array<any>) => T;
export type Dictionary = Record<string, unknown>;
