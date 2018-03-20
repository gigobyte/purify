import Functor from 'typeclasses/Functor'

export default interface Extend<T> extends Functor<T> {
    extend<U>(f: (value: Extend<T>) => U): Extend<U>
    'fantasy-land/extend'?: Extend<T>['extend']
}