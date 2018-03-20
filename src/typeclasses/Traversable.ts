import Applicative from 'typeclasses/Applicative'
import Foldable from 'typeclasses/Foldable'
import Functor from 'typeclasses/Functor'

export default interface Traversable<T> extends Functor<T>, Foldable<T> {
    traverse<U>(f: (value: T) => Applicative<U>): Applicative<Traversable<U>>
    'fantasy-land/traverse'?: Traversable<T>['traverse']
}