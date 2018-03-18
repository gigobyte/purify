import Functor from 'typeclasses/Functor'

export default interface Apply<T> extends Functor<T> {
    ap<U>(other: Apply<(value: T) => U>): Apply<U>
}