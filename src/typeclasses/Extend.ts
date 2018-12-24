import { Functor } from './Functor'

export interface Extend<T> extends Functor<T> {
  extend<U>(f: (value: Extend<T>) => U): Extend<U>
  'fantasy-land/extend'?: Extend<T>['extend']
}
