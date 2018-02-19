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

export const isNonEmpty = <T>(arr: T[]): arr is NonEmptyList<T> =>
    arr.length > 0

export const fromArray = <T>(arr: T[]): Maybe<NonEmptyList<T>> =>
    isNonEmpty(arr) ? Just(arr) : Nothing