export interface Semigroup<T extends Semigroup<T>> {
    concat(other: T): T
    'fantasy-land/concat'?: Semigroup<T>['concat']
}