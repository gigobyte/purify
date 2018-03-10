import { Maybe, Just, Nothing } from './Maybe'

export const _left: unique symbol = Symbol('Left')
export const _right: unique symbol = Symbol('Right')

export type Left<T> = {kind: typeof _left, value: T}
export type Right<T> = {kind: typeof _right, value: T}
export type Either<L, R> = Left<L> | Right<R>
export type EitherPatterns<L, R, T> = { Left: (l: L) => T, Right: (r: R) => T }

export const Left = <T>(value: T): Either<T, never> =>
    ({kind: _left, value})

export const Right = <T>(value: T): Either<never, T> =>
    ({kind: _right, value})

/** Returns true if the arguemnt is `Left` */
export const isLeft = <L, R>(either: Either<L, R>): either is Left<L> =>
    either.kind === _left

/** Returns true if the arguemnt is `Right` */
export const isRight = <L, R>(either: Either<L, R>): either is Right<R> =>
    either.kind === _right

/**
 * Given two map functions, transforms the value inside `Either` using the first if the value is `Left` or using the second one if the value is `Right`.
 * If both functions return the same type consider using `Either.either` instead
 * */
export const bimap = <L, R, L2, R2>(leftMapper: (value: L) => L2, rightMapper: (value: R) => R2, either: Either<L, R>): Either<L2, R2> =>
    isLeft(either) ? Left(leftMapper(either.value)) : Right(rightMapper(either.value))

/** Maps over the `Left` value of an Either, acts like an identity if the value is `Right` */
export const mapLeft = <L, R, T>(mapper: (value: L) => T, either: Either<L, R>): Either<T, R> =>
    bimap(mapper, x => x, either)

/**  Maps over the `Right` value of an Either, acts like an identity if the value is `Left` */
export const mapRight = <L, R, T>(mapper: (value: R) => T, either: Either<L, R>): Either<L, T> =>
    bimap(x => x, mapper, either)

/** Curried version of `Either.mapLeft` */
export const liftLeft = <L, T>(mapper: (value: L) => T) => <R>(either: Either<L, R>): Either<T, R> =>
    mapLeft(mapper, either)

/** Curried version of `Either.mapRight` */
export const liftRight = <R, T>(mapper: (value: R) => T) => <L>(either: Either<L, R>): Either<L, T> =>
    mapRight(mapper, either)

/** Structural pattern matching for Either in the form of a function */
export const caseOf = <L, R, T>(either: Either<L, R>, patterns: EitherPatterns<L, R, T>): T =>
    isLeft(either) ? patterns.Left(either.value) : patterns.Right(either.value)

/** Returns the value inside a `Left` or a default value if the either is `Right` */
export const leftOrDefault = <L, R>(defaultValue: L, either: Either<L, R>): L =>
    isLeft(either) ? either.value : defaultValue

/** Returns the value inside a `Right` or a default value if the either is `Left` */
export const rightOrDefault = <L, R>(defaultValue: R, either: Either<L, R>): R =>
    isLeft(either) ? defaultValue : either.value

/** Runs an effect if the either is `Left`, returns its argument for easier composiblity */
export const whenLeft = <L, R>(effect: (value: L) => any, either: Either<L, R>): Either<L, R> =>
    isLeft(either) ? (effect(either.value), either) : either

/** Runs an effect if the either is `Right`, returns its argument for easier composiblity */
export const whenRight = <L, R>(effect: (value: R) => any, either: Either<L, R>): Either<L, R> =>
    isLeft(either) ? either : (effect(either.value), either)

/** Constructs a `Just` with the value of the either if it's `Right` or a `Nothing` if the either is `Left` */
export const leftToMaybe = <L, R>(either: Either<L, R>): Maybe<L> =>
    isLeft(either) ? Just(either.value) : Nothing

/** Constructs a `Just` with the value of the either if it's `Left` or a `Nothing` if the either is `Right` */
export const rightToMaybe = <L, R>(either: Either<L, R>): Maybe<R> =>
    isLeft(either) ? Nothing : Just(either.value)

/** Applies a `Right` function over two `Right` values, returns `Left` if any of arguments are `Left` */
export const liftA2 = <L, R, R2, R3>(mapper: (a: R, b: R2) => R3, eitherA: Either<L, R>, eitherB: Either<L, R2>): Either<L, R3> =>
    isLeft(eitherA) ? eitherA : isLeft(eitherB) ? eitherB : Right(mapper(eitherA.value, eitherB.value))

/** Takes a list of eithers and returns a list of all the `Left` values unwrapped */
export const lefts = <L, R>(list: Either<L, R>[]): L[] =>
    list.filter(isLeft).map(x => x.value)

/** Takes a list of eithers and returns a list of all the `Right` values unwrapped */
export const rights = <L, R>(list: Either<L, R>[]): R[] =>
    list.filter(isRight).map(x => x.value)

/**
 * Given two map functions, maps using the first if the value is `Left` or using the second one if the value is `Right`.
 * If you want the functions to return different types depending on the either you may want to use `Either.bimap` instead
 * */
export const either = <L, R, T>(ifLeft:  (value: L) => T, ifRight: (value: R) => T, either: Either<L, R>): T =>
    isLeft(either) ? ifLeft(either.value) : ifRight(either.value)

/** Compares are values inside two eithers with `===`, returns false if the constructors are different, e.g. `equals(Right(5), Left(5))` is false */
export const equals = <L, R>(eitherA: Either<L, R>, eitherB: Either<L, R>): boolean =>
    (isLeft(eitherA) && isLeft(eitherB) && eitherA.value === eitherB.value) || (isRight(eitherA) && isRight(eitherB) && eitherA.value === eitherB.value)

/** Returns the first either if it's `Right`, otherwise it returns the second one */
export const alt = <L, R>(eitherA: Either<L, R>, eitherB: Either<L, R>): Either<L, R> =>
    isLeft(eitherA) ? eitherB : eitherA

/** Applies a `Right` function over a `Right` value. Returns `Left` if either of the arguments are `Left` */
export const ap = <L, R, T>(eitherF: Either<L, (value: R) => T>, either: Either<L, R>): Either<L, T> =>
    isLeft(eitherF) ? eitherF : mapRight(eitherF.value, either)

/** Transforms a `Either` value with a function that returns an `Either`. Useful for chaining many computations that may fail */
export const chain = <L, R, R2>(mapper: (value: R) => Either<L, R2>, either: Either<L, R>): Either<L, R2> =>
    isLeft(either) ? either : mapper(either.value)

/** Extracts the value out of an `Either` */
export const extract = <L, R>(either: Either<L,R>): L | R =>
    either.value

/** Calls a function and returns a `Right` if successful or the exception wrapped in `Left` in case of failure */
export const encase = <L extends Error, R>(throwsF: () => R): Either<L, R> =>
    { try { return Right(throwsF()) } catch(e) { return Left(e) } }