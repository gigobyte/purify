import Functor from './Functor'

export default interface Bifunctor<T, U> extends Functor<T | U> {
    bimap<I, P>(f: (value: T) => I, g: (value: U) => P): Bifunctor<I, P>
    'fantasy-land/bimap'?: Bifunctor<T, U>['bimap']
}