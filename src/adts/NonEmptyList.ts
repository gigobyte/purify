import { Maybe, Just, Nothing } from './Maybe'
import { Tuple } from './Tuple'

export type NonEmptyListCompliant<T> = T[] & { 0: T }

interface NonEmptyList<T> extends NonEmptyListCompliant<T> {
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

export const NonEmptyList: NonEmptyListTypeRef = <
  T extends NonEmptyListCompliant<T[number]>
>(
  list: T
): NonEmptyList<T[number]> => list as any

/** Return a `Just NonEmptyList` if the parameter has one or more elements, otherwise it returns `Nothing` */
NonEmptyList.fromArray = <T>(source: T[]): Maybe<NonEmptyList<T>> =>
  NonEmptyList.isNonEmpty(source) ? Just(source) : Nothing

/** Converts a `Tuple` to a `NonEmptyList` */

NonEmptyList.fromTuple = <T, U>(source: Tuple<T, U>): NonEmptyList<T | U> =>
  NonEmptyList(source.toArray())

/** Typecasts any array into a `NonEmptyList`, but throws an exception if the array is empty. Use `fromArray` as a safe alternative */
NonEmptyList.unsafeCoerce = <T>(source: T[]): NonEmptyList<T> =>
  NonEmptyList.isNonEmpty(source)
    ? source
    : (() => {
        throw new Error('NonEmptyList#unsafeCoerce passed an empty array')
      })()

/** Returns true and narrows the type if the passed array has one or more elements */
NonEmptyList.isNonEmpty = <T>(list: T[]): list is NonEmptyList<T> =>
  list.length > 0

/** The same function as \`List#head\`, but it doesn't return a Maybe as a NonEmptyList will always have a head */
NonEmptyList.head = <T>(list: NonEmptyList<T>): T => list[0]

/** The same function as \`List#last\`, but it doesn't return a Maybe as a NonEmptyList will always have a last element */
NonEmptyList.last = <T>(list: NonEmptyList<T>): T => list[list.length - 1]
