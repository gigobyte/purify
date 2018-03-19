import Functor from 'typeclasses/Functor'

export default interface Alt<T> extends Functor<T> {
    alt(other: Alt<T>): Alt<T>
    'fantasy-land/alt': Alt<T>['alt']
}