import Alt from 'typeclasses/Alt'

export default interface Plus<T> extends Alt<T> {
    zero(): Plus<T>
    'fantasy-land/zero': Plus<T>['zero']
}