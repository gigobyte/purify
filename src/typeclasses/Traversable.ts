import { Applicative } from './Applicative'
import { Foldable } from './Foldable'
import { Functor } from './Functor'

export interface Traversable<T> extends Functor<T>, Foldable<T> {
    traverse<U>(f: (value: T) => Applicative<U>): Applicative<Traversable<U>>
    'fantasy-land/traverse'?: Traversable<T>['traverse']
}