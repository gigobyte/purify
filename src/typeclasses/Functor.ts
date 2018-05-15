import { ExtractKinds, SetKinds, HigherKindedType, HigherKindedTypes } from './../utils/HigherKindedTypes'

export interface Functor<T> extends HigherKindedType {
    map<U>(f: (value: T) => U): Functor<U>
    'fantasy-land/map'?: Functor<T>['map']
}

export const map = <T extends Functor<any>, U>(f: (value: ExtractKinds<T>[0]) => U, functor: T): SetKinds<T, [U]> =>
    functor.map(f)