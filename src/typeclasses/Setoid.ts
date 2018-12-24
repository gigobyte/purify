export interface Setoid<T extends Setoid<T>> {
  equals(other: T): boolean
  'fantasy-land/equals'?: Setoid<T>['equals']
}
