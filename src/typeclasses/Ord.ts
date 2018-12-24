import { Setoid } from './Setoid'

export interface Ord<T extends Setoid<T>> extends Setoid<T> {
  lte(other: Ord<T>): boolean
  'fantasy-land/lte'?: Ord<T>['lte']
}
