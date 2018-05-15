export interface Foldable<T> {
    reduce<U>(reducer: (accumulator: U, value: T) => U, initialValue: U): U
    'fantasy-land/reduce'?: Foldable<T>['reduce']
}