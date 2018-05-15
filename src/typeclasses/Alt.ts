import { Functor } from './Functor'

export interface Alt<T> extends Functor<T> {
    alt(other: Alt<T>): Alt<T>
    'fantasy-land/alt'?: Alt<T>['alt']
}