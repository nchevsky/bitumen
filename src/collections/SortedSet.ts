import type Comparable from '../types/Comparable.ts';

/**
 * Sorted implementation of `Set` which leverages `Comparable`'s `compareTo()` and `equals()`
 * methods to determine the sort order of the set's elements.
 * 
 * @author Nick Chevsky
 */
export default class SortedSet<V extends Comparable | number | string> implements Set<V> {
  protected elements: Array<V> = [];

  constructor(values?: Iterable<V>) {
    if (values) for (const value of values) this.add(value);
  }

  [Symbol.iterator](): IterableIterator<V> {
    return this.elements[Symbol.iterator]();
  }

  get [Symbol.toStringTag](): string {
    return `SortedSet=[${this.elements.join(', ')}]`;
  }

  add(value: V): this {
    const successorIndex = this.elements.findIndex((element) => this.#compare(element, value) >= 0);
    if (successorIndex == -1) {
      this.elements.push(value);
    } else if (!this.#areEqual(this.elements[successorIndex]!, value)) {
      this.elements.splice(successorIndex, 0, value);
    }
    return this;
  }

  #areEqual(valueA: V, valueB: V) { // eslint-disable-line class-methods-use-this -- statics can't use class type args
    return typeof valueA == 'object' ? valueA.equals(valueB as Comparable) : valueA === valueB;
  }

  clear() {
    this.elements.splice(0);
  }

  #compare(valueA: V, valueB: V) { // eslint-disable-line class-methods-use-this -- statics can't use class type args
    return typeof valueA == 'object'
      ? valueA.compareTo(valueB as Comparable)
      : typeof valueA == 'number'
        ? (valueA < (valueB as number) ? -1 : (valueA > (valueB as number) ? 1 : 0))
        : valueA.localeCompare(valueB as string);
  }

  delete(value: V): boolean {
    const index = this.elements.findIndex((element) => this.#areEqual(element, value));
    if (index != -1) {
      this.elements.splice(index, 1);
      return true;
    }
    return false;
  }

  entries(): IterableIterator<[V, V]> {
    return this.elements.map((element) => [element, element] as [V, V])[Symbol.iterator]();
  }

  forEach(callback: (key: V, value: V, set: this) => void, thisArg?: any) {
    this.elements.forEach((element) => callback(element, element, this), thisArg);
  }

  has(value: V): boolean {
    return this.elements.some((element) => this.#areEqual(element, value));
  }

  keys(): IterableIterator<V> {
    return this[Symbol.iterator]();
  }

  get size() {
    return this.elements.length;
  }

  values(): IterableIterator<V> {
    return this[Symbol.iterator]();
  }
}
