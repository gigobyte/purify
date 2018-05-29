import { Tuple } from '../adts/Tuple';
import { Maybe, Just, Nothing } from "../adts/Maybe"

export const head = <T>(list: T[]): Maybe<T> =>
    list.length > 0 ? Just(list[0]) : Nothing

export const last = <T>(list: T[]): Maybe<T> =>
    list.length > 0 ? Just(list[list.length - 1]) : Nothing

export const tail = <T>(list: T[]): Maybe<T[]> =>
    list.length > 0 ? Just(list.slice(1)) : Nothing

export const init = <T>(list: T[]): Maybe<T[]> =>
    list.length > 0 ? Just(list.slice(0, -1)) : Nothing

export const uncons = <T>(list: T[]): Maybe<Tuple<T, T[]>> =>
    list.length > 0 ? Just(Tuple(list[0], list.slice(1))) : Nothing