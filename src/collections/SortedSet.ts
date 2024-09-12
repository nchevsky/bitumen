import type Comparable from '../types/Comparable.ts';

type ComparableSet<E extends Element> = Omit<
  Set<E>, 'add' | 'difference' | 'forEach' | 'intersection' | 'symmetricDifference' | 'union'
> & {
  add: (...args: Parameters<Set<E>['add']>) => SortedSet<E>,
  difference: (another: ReadonlySetLike<E>) => SortedSet<E>,
  forEach: (callback: (value: E, key: E, set: SortedSet<E>) => void, thisArg?: any) => void,
  intersection: (another: ReadonlySetLike<E>) => SortedSet<E>,
  symmetricDifference: (another: ReadonlySetLike<E>) => SortedSet<E>,
  union: (another: ReadonlySetLike<E>) => SortedSet<E>
};

type Element = Comparable | number | string;

function areEqual(valueA: Element, valueB: Element) {
  return typeof valueA == 'object' ? valueA.equals(valueB as Comparable) : valueA === valueB;
}

function compare(valueA: Element, valueB: Element) {
  return typeof valueA == 'object'
    ? valueA.compareTo(valueB as Comparable)
    : typeof valueA == 'number'
      ? (valueA < (valueB as number) ? -1 : (valueA > (valueB as number) ? 1 : 0))
      : valueA.localeCompare(valueB as string);
}

/**
 * Sorted implementation of `Set` with support for `Comparable` objects.
 * 
 * @author Nick Chevsky
 */
export default class SortedSet<E extends Element> implements ComparableSet<E> {
  protected elements: Array<E> = [];

  constructor(values?: Iterable<E>) {
    if (values) for (const value of values) this.add(value);
  }

  [Symbol.iterator](): IterableIterator<E> {
    return this.elements[Symbol.iterator]();
  }

  get [Symbol.toStringTag]() {
    return `SortedSet=[${this.elements.join(', ')}]`;
  }

  add(value: E) {
    const successorIndex = this.elements.findIndex((element) => compare(element, value) >= 0);
    if (successorIndex == -1) {
      this.elements.push(value);
    } else if (!areEqual(this.elements[successorIndex]!, value)) {
      this.elements.splice(successorIndex, 0, value);
    }
    return this;
  }

  clear() {
    this.elements.splice(0);
  }

  delete(value: E) {
    const index = this.elements.findIndex((element) => areEqual(element, value));
    if (index != -1) {
      this.elements.splice(index, 1);
      return true;
    }
    return false;
  }

  difference(another: ReadonlySetLike<E>) {
    // elements of ours that `another` doesn't have
    return new SortedSet(this.elements.filter((element) => !another.has(element)));
  }

  entries(): IterableIterator<[E, E]> {
    return this.elements.map((element) => [element, element] as [E, E])[Symbol.iterator]();
  }

  forEach(callback: (value: E, key: E, set: SortedSet<E>) => void, thisArg?: any) {
    this.elements.forEach((element) => callback(element, element, this), thisArg);
  }

  has(value: E): boolean {
    return this.elements.some((element) => areEqual(element, value));
  }

  intersection(another: ReadonlySetLike<E>) {
    if (this.size > another.size) {
      // elements of `another` that we also have
      const iterator = another.keys(), result = new SortedSet<E>();
      let element = iterator.next();
      while (!element.done) {
        if (this.has(element.value)) result.add(element.value);
        element = iterator.next();
      }
      return result;
    }

    // elements of ours that `another` also has
    return new SortedSet(this.elements.filter((element) => another.has(element)));
  }

  isDisjointFrom(another: SortedSet<E>) {
    if (this.size > another.size) {
      const iterator = another.keys();
      let element = iterator.next();
      while (!element.done) {
        if (this.has(element.value)) return false;
        element = iterator.next();
      }
      return true;
    }

    return !this.elements.some((element) => another.has(element));
  }

  isSubsetOf(another: SortedSet<E>) {
    if (this.size > another.size) return false;

    return this.elements.every((element) => another.has(element));
  }

  isSupersetOf(another: SortedSet<E>) {
    if (this.size < another.size) return false;

    const iterator = another.keys();
    let element = iterator.next();
    while (!element.done) {
      if (!this.has(element.value)) return false;
      element = iterator.next();
    }

    return true;
  }

  keys(): IterableIterator<E> {
    return this[Symbol.iterator]();
  }

  get size() {
    return this.elements.length;
  }

  symmetricDifference(another: ReadonlySetLike<E>) {
    // elements of ours that `another` doesn't have
    const result = new SortedSet<E>(this.elements.filter((element) => !another.has(element)));

    // elements of `another` that we don't have
    const iterator = another.keys();
    let element = iterator.next();
    while (!element.done) {
      if (!this.has(element.value)) result.add(element.value);
      element = iterator.next();
    }

    return result;
  }

  union(another: ReadonlySetLike<E>) {
    // elements of ours
    const result = new SortedSet<E>(this);

    // elements of `another`
    const iterator = another.keys();
    let element = iterator.next();
    while (!element.done) {
      result.add(element.value);
      element = iterator.next();
    }

    return result;
  }

  values(): IterableIterator<E> {
    return this[Symbol.iterator]();
  }
}
