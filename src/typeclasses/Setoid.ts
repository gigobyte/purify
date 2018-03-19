export default interface Setoid<T> {
    equals(other: Setoid<T>): boolean
    'fantasy-land/equals': Setoid<T>['equals']
}