export default interface Setoid<T> {
    equals(other: Setoid<T>): boolean
}