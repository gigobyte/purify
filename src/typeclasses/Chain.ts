import { Apply } from './Apply'

export interface Chain<T> extends Apply<T> {
  chain<U>(f: (value: T) => Chain<U>): Chain<U>
  'fantasy-land/chain'?: Chain<T>['chain']
}
