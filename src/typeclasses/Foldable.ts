export default interface Foldable<T> {
    reduce<U>(reducer: (value: T) => U, initialValue: T): U
    'fantasy-land/reduce'?: Foldable<T>['reduce']
}