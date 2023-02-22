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
  concat(...items: ConcatArray<T>[]): NonEmptyList<T>
  concat(...items: (T | ConcatArray<T>)[]): NonEmptyList<T>
}

export interface NonEmptyListTypeRef {
  /** Typecasts an array with at least one element into a `NonEmptyList`. Works only if the compiler can confirm that the array has one or more elements */
  <T extends NonEmptyListCompliant<T[number]>>(list: T): NonEmptyList<T[number]>
  /** Returns a `Just NonEmptyList` if the parameter has one or more elements, otherwise it returns `Nothing` */
  fromArray<T>(source: readonly T[]): Maybe<NonEmptyList<T>>
  /** Converts a `Tuple` to a `NonEmptyList` */
  fromTuple<T, U>(source: Tuple<T, U>): NonEmptyList<T | U>
  /** Typecasts any array into a `NonEmptyList`, but throws an exception if the array is empty. Use `fromArray` as a safe alternative */
  unsafeCoerce<T>(source: readonly T[]): NonEmptyList<T>
  /** Returns true and narrows the type if the passed array has one or more elements */
  isNonEmpty<T>(list: readonly T[]): list is NonEmptyList<T>
  /** The same function as \`List#head\`, but it doesn't return a Maybe as a NonEmptyList will always have a head */
  head<T>(list: NonEmptyList<T>): T
  /** The same function as \`List#last\`, but it doesn't return a Maybe as a NonEmptyList will always have a last element */
  last<T>(list: NonEmptyList<T>): T
  /** The same function as \`List#tail\`, but it doesn't return a Maybe as a NonEmptyList will always have a tail (although it may be of length 0) */
  tail<T>(list: NonEmptyList<T>): T[]
}

const NonEmptyListConstructor = <T extends NonEmptyListCompliant<T[number]>>(
  list: T
): NonEmptyList<T[number]> => list as any

export const NonEmptyList: NonEmptyListTypeRef = Object.assign(
  NonEmptyListConstructor,
  {
    fromArray: <T>(source: readonly T[]): Maybe<NonEmptyList<T>> =>
      NonEmptyList.isNonEmpty(source) ? Just(source) : Nothing,
    unsafeCoerce: <T>(source: readonly T[]): NonEmptyList<T> => {
      if (NonEmptyList.isNonEmpty(source)) {
        return source
      }

      throw new Error('NonEmptyList#unsafeCoerce was ran on an empty array')
    },
    fromTuple: <T, U>(source: Tuple<T, U>): NonEmptyList<T | U> =>
      NonEmptyList(source.toArray()),
    head: <T>(list: NonEmptyList<T>): T => list[0],
    last: <T>(list: NonEmptyList<T>): T => list[list.length - 1]!,
    isNonEmpty: <T>(list: readonly T[]): list is NonEmptyList<T> =>
      list.length > 0,
    tail: <T>(list: NonEmptyList<T>): T[] => list.slice(1)
  }
)
