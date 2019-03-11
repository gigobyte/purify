import { Tuple } from './Tuple'
import { Maybe, Just, Nothing } from './Maybe'

/** Returns Just the first element of an array or Nothing if there is none. If you don't want to work with a Maybe but still keep type safety, check out `NonEmptyList` */
const head = <T>(list: T[]): Maybe<T> =>
  list.length > 0 ? Just(list[0]) : Nothing

/** Returns Just the last element of an array or Nothing if there is none */
const last = <T>(list: T[]): Maybe<T> =>
  list.length > 0 ? Just(list[list.length - 1]) : Nothing

/** Returns all elements of an array except the first */
const tail = <T>(list: T[]): Maybe<T[]> =>
  list.length > 0 ? Just(list.slice(1)) : Nothing

/** Returns all elements of an array except the last */
const init = <T>(list: T[]): Maybe<T[]> =>
  list.length > 0 ? Just(list.slice(0, -1)) : Nothing

/** Returns a tuple of an array's head and tail */
const uncons = <T>(list: T[]): Maybe<Tuple<T, T[]>> =>
  list.length > 0 ? Just(Tuple(list[0], list.slice(1))) : Nothing

/* Returns the sum of all numbers inside an array */
const sum = (list: number[]): number => list.reduce((acc, x) => acc + x, 0)

/** Returns the first element which satisfies a predicate. A more typesafe version of the already existing List.prototype.find */
function find<T>(
  f: (x: T, index: number, arr: T[]) => boolean,
  list: T[]
): Maybe<T>
function find<T>(
  f: (x: T, index: number, arr: T[]) => boolean
): (list: T[]) => Maybe<T>
function find<T>(
  f: (x: T, index: number, arr: T[]) => boolean,
  list?: T[]
): any {
  switch (arguments.length) {
    case 1:
      return (list: T[]) => find(f, list)
    default:
      return Maybe.fromNullable(list!.find(f))
  }
}

/** Returns the index of the first element which satisfies a predicate. A more typesafe version of the already existing List.prototype.findIndex */
function findIndex<T>(
  f: (x: T, index: number, arr: T[]) => boolean,
  list: T[]
): Maybe<number>
function findIndex<T>(
  f: (x: T, index: number, arr: T[]) => boolean
): (list: T[]) => Maybe<number>
function findIndex<T>(
  f: (x: T, index: number, arr: T[]) => boolean,
  list?: T[]
): any {
  switch (arguments.length) {
    case 1:
      return (list: T[]) => findIndex(f, list)
    default:
      return Maybe.fromPredicate(x => x !== -1, list!.findIndex(f))
  }
}

/** Returns the element at a given index of a list */
function at<T>(index: number, list: T[]): Maybe<T>
function at<T>(index: number): (list: T[]) => Maybe<T>
function at<T>(index: number, list?: T[]): any {
  switch (arguments.length) {
    case 1:
      return (list: T[]) => at(index, list)
    default:
      return list![index] === undefined ? Nothing : Just(list![index])
  }
}

export const List = { init, uncons, at, head, last, tail, find, findIndex, sum }
