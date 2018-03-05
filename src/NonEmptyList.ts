import { Maybe, Just, Nothing } from './Maybe'

export type NonEmptyList<T>
    = [T]
    | [T, T]
    | [T, T, T]
    | [T, T, T, T]
    | [T, T, T, T, T]
    | [T, T, T, T, T, T]
    | [T, T, T, T, T, T, T]
    | [T, T, T, T, T, T, T, T]
    | [T, T, T, T, T, T, T, T, T]
    | [T, T, T, T, T, T, T, T, T, T]

type ArrayWithOneElement<T extends Array<any> & {0: T['0']}> = Array<any> & {0: T['0']}

export const NonEmptyList = <T extends ArrayWithOneElement<T>>(arr: T): NonEmptyList<T['0']> =>
    arr as NonEmptyList<T['0']>

/** Checks whether an array has one or more elements */
export const isNonEmpty = <T>(arr: T[]): arr is NonEmptyList<T> =>
    arr.length > 0

/** Returns a `Just NonEmptyList` if the array parameter has one or more elements, otherwise it results `Nothing` */
export const fromArray = <T>(arr: T[]): Maybe<NonEmptyList<T>> =>
    isNonEmpty(arr) ? Just(arr) : Nothing

/** Typecasts any array into a `NonEmptyList`. Throws an exception if the array is empty. Use `fromArray` as a safe alternative */
export const unsafeCoerce = <T>(arr: T[]): NonEmptyList<T> =>
    isNonEmpty(arr) ? NonEmptyList(arr) : (() => { throw new Error('Unexpected empty array') })()