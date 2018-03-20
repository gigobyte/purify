import Apply from 'typeclasses/Apply'

export default interface Applicative<T> extends Apply<T> {
    of(value: T): Applicative<T>
    'fantasy-land/of'?: Applicative<T>['of']
}