import { Maybe, Just, Nothing } from './Maybe'
import { Tuple } from './Tuple'

export type NonEmptyListCompliant<T> = T[] & {0: T}

export interface NonEmptyList<T> extends NonEmptyListCompliant<T> {
    map<U>(this: NonEmptyList<T>, callbackfn: (value: T, index: number, array: NonEmptyList<T>) => U, thisArg?: any): NonEmptyList<U>
    reverse(this: NonEmptyList<T>): NonEmptyList<T>
}

export interface INonEmptyList {
    <T extends NonEmptyListCompliant<T[number]>>(list: T): NonEmptyList<T[number]>
    fromArray: typeof fromArray
    fromTuple: typeof fromTuple
    unsafeCoerce: typeof unsafeCoerce
}

/** Returns true and narrows the type if the passed array has one or more elements */
const isNonEmpty = <T>(list: T[]): list is NonEmptyList<T> =>
    list.length > 0

/** Return a `Just NonEmptyList` if the parameter has one or more elements, otherwise it returns `Nothing` */
const fromArray = <T>(source: T[]): Maybe<NonEmptyList<T>> =>
    isNonEmpty(source) ? Just(source) : Nothing

/** Converts a `Tuple` to a `NonEmptyList` */
const fromTuple = <T, U>(source: Tuple<T, U>): NonEmptyList<T | U> =>
    NonEmptyList(source.toArray())

/** Typecasts any array into a `NonEmptyList`, but throws an exception if the array is empty. Use `fromArray` as a safe alternative */
const unsafeCoerce = <T>(source: T[]): NonEmptyList<T> =>
    isNonEmpty(source) ? source : (() => { throw new Error('NonEmptyList#unsafeCoerce passed an empty array') })()

/** The same function as \`List#head\`, but it doesn't return a Maybe as a NonEmptyList will always have a head */
const head = <T>(list: NonEmptyList<T>): T =>
    list[0]

/** The same function as \`List#last\`, but it doesn't return a Maybe as a NonEmptyList will always have a last element */
const last = <T>(list: NonEmptyList<T>): T =>
    list[list.length - 1]

const NonEmptyListConstructor = <T extends NonEmptyListCompliant<T[number]>>(list: T): NonEmptyList<T[number]> =>
    list as any as NonEmptyList<T[number]>

export const NonEmptyList: INonEmptyList = Object.assign(NonEmptyListConstructor, {fromArray, fromTuple, unsafeCoerce})
export { isNonEmpty, head, last }