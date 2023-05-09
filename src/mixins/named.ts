import type Comparable from '../types/Comparable.js';
import {type Constructor, isComparable} from '../types/index.js';

/**
 * Augments an entity with a `name` property and name-based implementations of `Comparable`'s `compareTo()` and
 * `equals()` methods. If the entity has its own implementation of `equals()`, it is left alone and called as-is.
 * 
 * @author Nick Chevsky
 */
export default function <T extends Constructor>(Base: T) {
  abstract class Named extends Base implements Comparable {
    /** Name of the entity. */
    name: string = '';

    compareTo(another: this): number {
      return this.name.localeCompare(another.name, undefined, {sensitivity: 'base', usage: 'sort'});
    }

    equals(another: this): boolean {
      // if the base entity already has its own implementation, do not override it and call it as-is
      const base = Base.prototype as unknown;
      if (isComparable(base) && 'equals' in base) return base.equals.call(this, another);

      return !!this.name // if name is blank, refuse to compare it
        && this.name.localeCompare(another.name, undefined, {sensitivity: 'base', usage: 'search'}) == 0;
    }
  }

  return Named;
}
