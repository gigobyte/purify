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

export const chain = <T, U>(mapper: (value: T) => Maybe<U>, maybe: Maybe<T>): Maybe<U> =>
    isNothing(maybe) ? Nothing : mapper(maybe)

export const caseOf = <T, U>(maybe: Maybe<T>, patterns: MaybePatterns<T, U>): Maybe<U> =>
    isNothing(maybe) ? patterns.Nothing() : patterns.Just(maybe)

export const from = <T>(nullableValue: T): Maybe<T> =>
    nullableValue == null ? Nothing : Just(nullableValue)