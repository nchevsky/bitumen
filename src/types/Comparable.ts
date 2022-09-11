/**
 * Describes an entity with an identity that can be compared to others.
 * 
 * @author Nick Chevsky
 */
export default interface Comparable {
  /**
   * Compares the entity to another and determines which should come first for ordering purposes.
   * 
   * @param another - Entity to which to compare this one.
   * @returns Zero if the two entities are equivalent, a negative number if this entity comes
   *          before `another`, or a positive number if this entity goes after `another`.
   */
  compareTo(another: this): number;

  /**
   * Compares the entity to another and determines if they are equivalent.
   * 
   * @param another - Entity to which to compare this one.
   * @returns `true` if the two entities are equivalent, or `false` if they differ.
   */
  equals(another: this): boolean;
}
