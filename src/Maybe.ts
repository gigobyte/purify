import { Either, Right, Left } from './Either'

type NonNullable<T> = T & {}
type Semigroup<T={}> = {concat: (...args: T[]) => T}

export type Nothing = null | undefined
export type Just<T> = T & {kind: 'Just'}
export type Maybe<T> = Just<T> | Nothing
export type MaybePatterns<T, U> = {Just: (value: T) => U, Nothing: () => U}

export const Just = <T>(value: T): Maybe<T> =>
    value as Maybe<T>

export const Nothing =
    null as Maybe<never>

/** Turns a nullable value into a Maybe */
export const of = <T>(nullableValue: T): Maybe<NonNullable<T>> =>
    nullableValue == null ? Nothing : Just(nullableValue)

/** Returns a Nothing if the argument is falsy or a Just if the argument is truthy */
export const weakOf = <T>(value: T): Maybe<NonNullable<T>> =>
    value ? Just(value) : Nothing

/** Returns true if the arguemnt is Nothing */
export const isNothing = <T>(maybe: Maybe<T>): maybe is Nothing =>
    maybe == null

/** Returns true if the argument is Just  */
export const isJust = <T>(maybe: Maybe<T>): maybe is Just<T> =>
    maybe != null

/** Transforms a Maybe value with a given function */
export const map = <T, U>(mapper: (value: T) => U, maybe: Maybe<T>): Maybe<U> =>
    isNothing(maybe) ? Nothing : Just(mapper(maybe))

/** Applies a Maybe function over two Maybe values */
export const liftA2 = <T, U, I>(mapper: (a: T, b: U) => I, maybeA: Maybe<T>, maybeB: Maybe<U>): Maybe<I> =>
    (isNothing(maybeA) || isNothing(maybeB)) ? Nothing : Just(mapper(maybeA, maybeB))

/** Transforms a Maybe value with a function that returns a Maybe. Useful for chaining many computations that may fail */
export const chain = <T, U>(mapper: (value: T) => Maybe<U>, maybe: Maybe<T>): Maybe<U> =>
    isNothing(maybe) ? Nothing : mapper(maybe)

/** Structural pattern matching for Maybe in the form of a function */
export const caseOf = <T, U>(maybe: Maybe<T>, patterns: MaybePatterns<T, U>): U =>
    isNothing(maybe) ? patterns.Nothing() : patterns.Just(maybe)

/** Returns the first Just between two Maybe values or Nothing if both are values are missing */
export const alt = <T>(maybe1: Maybe<T>, maybe2: Maybe<T>): Maybe<T> =>
    isNothing(maybe1) ? maybe2 : maybe1

/** Applies a Maybe function over a Maybe value */
export const ap = <T, U>(maybeF: Maybe<(value: T) => U>, maybe: Maybe<T>): Maybe<U> =>
    isNothing(maybeF) ? Nothing : map(maybeF, maybe)

/** Returns the default value if the Maybe is Nothing, otherwise it unwraps the Just and returns it */
export const withDefault = <T>(defaultValue: T, maybe: Maybe<T>): T =>
    isNothing(maybe) ? defaultValue : maybe

/** Curried version of Maybe.map */
export const lift = <T, U>(mapper: (value: T) => U) => (maybe: Maybe<T>): Maybe<U> =>
    map(mapper, maybe)

/** Curried version of Maybe.chain */
export const liftM = <T, U>(mapper: (value: T) => Maybe<U>) => (maybe: Maybe<T>): Maybe<U> =>
    chain(mapper, maybe)

/** Returns empty list if the Maybe is Nothing or a singleton list where the element is the value of Just */
export const toList = <T>(maybe: Maybe<T>): T[] =>
    isNothing(maybe) ? [] : [maybe]

/** Returns only the Just values in a list */
export const catMaybes = <T>(list: Maybe<T>[]): T[] =>
    list.filter(isJust)

/** Maps over a list of values and returns a list of all resulting Just values */
export const mapMaybe = <T, U>(mapper: (value: T) => Maybe<U>, list: T[]): U[] =>
    catMaybes(list.map(mapper))

/** Maps over a Maybe value and returns the result if the value is Just or returns the default value if the value is Nothing */
export const mapWithDefault = <T, U>(defaultValue: U, mapper: (value: T) => U, maybe: Maybe<T>): U =>
    withDefault(defaultValue, map(mapper, maybe))

/** Concatenates two Semigroup values wrapped in Maybe. Returns Nothing if one of the values is Nothing */
export const concat = <T extends Semigroup<T>>(maybe1: Maybe<T>, maybe2: Maybe<T>): Maybe<T> => 
    isNothing(alt(maybe1, maybe2)) ? Nothing : (isJust(maybe1) && isJust(maybe2)) ? Just(maybe1.concat(maybe2)) : isJust(maybe1) ? maybe1 : maybe2

/** Applies a function over a Just value or over a default value if the value is Nothing */
export const reduce = <T, U>(reducer: (value: T) => U, initialValue: T, maybe: Maybe<T>): U  =>
    reducer(withDefault(initialValue, maybe))

/** Type casts a Maybe into a nullable type */
export const toNullable = <T>(maybe: Maybe<T>): T | null =>
    isNothing(maybe) ? null : maybe

/** Calls a function that may throw and wraps the result in a Just if successful or Nothing if an error is caught */
export const encase = <T>(throwsF: () => T): Maybe<T> =>
   { try { return Just(throwsF()) } catch { return Nothing } }

/** Constructs a Right from a Just or a Left with a provided value if the value is Nothing */
export const toEither = <T, U>(left: T, maybe: Maybe<U>): Either<T, U> =>
    isNothing(maybe) ? Left(left) : Right(maybe)

/** Extracts the value out of a Maybe, throws if the value is null */
export const unsafeCoerce = <T>(maybe: Maybe<T>): T =>
    isNothing(maybe) ? (() => { throw new Error('Maybe got coerced to a null') })() : maybe