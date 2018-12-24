import { Alt } from './Alt'

export interface Plus<T> extends Alt<T> {
  zero(): Plus<T>
  'fantasy-land/zero'?: Plus<T>['zero']
}
