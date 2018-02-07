       type NonNullable<T> = T & {}
export type Nothing = void | null | undefined
export type Just<T> = T
export type Maybe<T> = Just<T> | Nothing
export type MaybePatterns<T, U> = {Just: (value: T) => U, Nothing: () => U}

export const Just = <T>(value: T): Maybe<T> =>
    value

export const Nothing =
    null as Nothing

export const isNothing = <T>(maybe: Maybe<T>): maybe is Nothing =>
    maybe == null

export const isJust = <T>(maybe: Maybe<T>): maybe is Just<T> =>
    maybe != null

export const map = <T, U>(mapper: (value: T) => U, maybe: Maybe<T>): Maybe<U> =>
    isNothing(maybe) ? Nothing : Just(mapper(maybe))

export const map2 = <T, U, I>(mapper: (a: T, b: U) => I, maybeA: Maybe<T>, maybeB: Maybe<U>): Maybe<I> =>
    (isNothing(maybeA) || isNothing(maybeB)) ? Nothing : Just(mapper(maybeA, maybeB))

export const chain = <T, U>(mapper: (value: T) => Maybe<U>, maybe: Maybe<T>): Maybe<U> =>
    isNothing(maybe) ? Nothing : mapper(maybe)

export const caseOf = <T, U>(maybe: Maybe<T>, patterns: MaybePatterns<T, U>): Maybe<U> =>
    isNothing(maybe) ? patterns.Nothing() : patterns.Just(maybe)

export const of = <T>(nullableValue: T): Maybe<NonNullable<T>> =>
    nullableValue == null ? Nothing : Just(nullableValue)

export const alt = <T>(maybe1: Maybe<T>, maybe2: Maybe<T>): Maybe<T> =>
    isNothing(maybe1) ? isNothing(maybe2) ? Nothing : maybe2 : maybe1

export const ap = <T, U>(maybeF: Maybe<(value: T) => U>, maybe: Maybe<T>): Maybe<U> =>
    isNothing(maybeF) ? Nothing : map(maybeF, maybe)

export const withDefault = <T>(defaultValue: T, maybe: Maybe<T>): T =>
    isNothing(maybe) ? defaultValue : maybe

export const lift = <T, U>(mapper: (value: T) => U) => (maybe: Maybe<T>): Maybe<U> =>
    map(mapper, maybe)

export const liftM = <T, U>(mapper: (value: T) => Maybe<U>) => (maybe: Maybe<T>): Maybe<U> =>
    chain(mapper, maybe)

export const toList = <T>(maybe: Maybe<T>): never[] | [T] =>
    isNothing(maybe) ? [] : [maybe]

export const catMaybes = <T>(list: Maybe<T>[]): T[] =>
    list.filter(isJust)

export const mapMaybe = <T, U>(mapper: (value: T) => Maybe<U>, list: T[]): U[] =>
    catMaybes(list.map(mapper))