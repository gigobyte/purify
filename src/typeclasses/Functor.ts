export default interface Functor<T> {
    map<U>(f: (value: T) => U): Functor<U>
    'fantasy-land/map': Functor<T>['map']
}