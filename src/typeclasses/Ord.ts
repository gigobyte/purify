import Setoid from 'typeclasses/Setoid'

export default interface Ord<T> extends Setoid<T> {
    lte(other: Ord<T>): boolean
}