import { Tuple } from '../adts/Tuple'
import { Maybe, Just, Nothing } from '../adts/Maybe'

/** Returns Just the first element of an array or Nothing if there is none. If you don't want to work with a Maybe but still keep type safety, check out `NonEmptyList` */
export const head = <T>(list: T[]): Maybe<T> =>
  list.length > 0 ? Just(list[0]) : Nothing

/** Returns Just the last element of an array or Nothing if there is none */
export const last = <T>(list: T[]): Maybe<T> =>
  list.length > 0 ? Just(list[list.length - 1]) : Nothing

/** Returns all elements of an array except the first */
export const tail = <T>(list: T[]): Maybe<T[]> =>
  list.length > 0 ? Just(list.slice(1)) : Nothing

/** Returns all elements of an array except the last */
export const init = <T>(list: T[]): Maybe<T[]> =>
  list.length > 0 ? Just(list.slice(0, -1)) : Nothing

/** Returns a tuple of an array's head and tail */
export const uncons = <T>(list: T[]): Maybe<Tuple<T, T[]>> =>
  list.length > 0 ? Just(Tuple(list[0], list.slice(1))) : Nothing

/** Returns the element at a given index of a list */
function at<T>(index: number, list: T[]): Maybe<T>
function at<T>(index: number): (list: T[]) => Maybe<T>
function at<T>(index: number, list?: T[]): any {
  if (list === undefined) {
    return (list: T[]) =>
      list[index] === undefined ? Nothing : Just(list[index])
  }

  return list[index] === undefined ? Nothing : Just(list[index])
}

export { at }
