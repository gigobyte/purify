import { Functor } from './Functor'

export interface Apply<T> extends Functor<T> {
    ap<U>(other: Apply<(value: T) => U>): Apply<U>
    'fantasy-land/ap'?: Apply<T>['ap']
}