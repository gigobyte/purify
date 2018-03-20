import Semigroup from 'typeclasses/Semigroup'

export default interface Monoid<T extends Semigroup<T>> extends Semigroup<T> {
    empty(): T
    'fantasy-land/empty'?: Monoid<T>['empty']
}