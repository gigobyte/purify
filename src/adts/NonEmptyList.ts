import { Maybe, Just, Nothing } from './Maybe'
import { Tuple } from './Tuple'

export type NonEmptyListCompliant<T> = T[] & { 0: T }

export interface NonEmptyList<T> extends NonEmptyListCompliant<T> {
  map<U>(
    this: NonEmptyList<T>,
    callbackfn: (value: T, index: number, array: NonEmptyList<T>) => U,
    thisArg?: any
  ): NonEmptyList<U>
  reverse(this: NonEmptyList<T>): NonEmptyList<T>
}

export interface NonEmptyListTypeRef {
  <T extends NonEmptyListCompliant<T[number]>>(list: T): NonEmptyList<T[number]>
  fromArray<T>(source: T[]): Maybe<NonEmptyList<T>>
  fromTuple<T, U>(source: Tuple<T, U>): NonEmptyList<T | U>
  unsafeCoerce<T>(source: T[]): NonEmptyList<T>
  isNonEmpty<T>(list: T[]): list is NonEmptyList<T>
  head<T>(list: NonEmptyList<T>): T
  last<T>(list: NonEmptyList<T>): T
}

const NonEmptyListConstructor = <T extends NonEmptyListCompliant<T[number]>>(
  list: T
): NonEmptyList<T[number]> => list as any

export const NonEmptyList: NonEmptyListTypeRef = Object.assign(
  NonEmptyListConstructor,
  {
    fromArray: <T>(source: T[]): Maybe<NonEmptyList<T>> =>
      NonEmptyList.isNonEmpty(source) ? Just(source) : Nothing,
    unsafeCoerce: <T>(source: T[]): NonEmptyList<T> =>
      NonEmptyList.isNonEmpty(source)
        ? source
        : (() => {
            throw new Error('NonEmptyList#unsafeCoerce passed an empty array')
          })(),
    fromTuple: <T, U>(source: Tuple<T, U>): NonEmptyList<T | U> =>
      NonEmptyList(source.toArray()),
    head: <T>(list: NonEmptyList<T>): T => list[0],
    last: <T>(list: NonEmptyList<T>): T => list[list.length - 1],
    isNonEmpty: <T>(list: T[]): list is NonEmptyList<T> => list.length > 0
  }
)
