import { HigherKindedType } from '../utils/HigherKindedTypes'

export interface Foldable<T> extends HigherKindedType {
    reduce<U>(reducer: (accumulator: U, value: T) => U, initialValue: U): U
    'fantasy-land/reduce'?: Foldable<T>['reduce']
}