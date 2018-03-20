export default interface Setoid<T> {
    equals(other: Setoid<T>): other is this
    'fantasy-land/equals': Setoid<T>['equals']
}