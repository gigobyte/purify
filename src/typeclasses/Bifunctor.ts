import { Functor } from './Functor'

export interface Bifunctor<T, U> extends Functor<U> {
    bimap<I, P>(f: (value: T) => I, g: (value: U) => P): Bifunctor<I, P>
    'fantasy-land/bimap'?: Bifunctor<T, U>['bimap']
}