import Semigroup from 'typeclasses/Semigroup'

export default interface Monoid<T> extends Semigroup<T> {
    empty(): Monoid<T>
}