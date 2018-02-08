import { Maybe, Just, Nothing } from './Maybe'

export const _left: unique symbol = Symbol('Left')
export const _right: unique symbol = Symbol('Right')

export type Left<T> = {kind: typeof _left, value: T}
export type Right<T> = {kind: typeof _right, value: T}
export type Either<L, R> = Left<L> | Right<R>
export type EitherPatterns<L, R, T> = { Left: (l: L) => T, Right: (r: R) => T }

export const Left = <T>(value: T): Left<T> =>
    ({kind: _left, value})

export const Right = <T>(value: T): Right<T> =>
    ({kind: _right, value})

export const isLeft = <L, R>(either: Either<L, R>): either is Left<L> =>
    either.kind === _left

export const isRight = <L, R>(either: Either<L, R>): either is Right<R> =>
    either.kind === _right

export const bimap = <L, R, T, U>(leftMapper: (value: L) => T, rightMapper: (value: R) => U, either: Either<L, R>): Either<T, U> =>
    isLeft(either) ? Left(leftMapper(either.value)) : Right(rightMapper(either.value))

export const mapLeft = <L, R, T>(mapper: (value: L) => T, either: Either<L, R>): Either<T, R> =>
    bimap(mapper, x => x, either)

export const mapRight = <L, R, T>(mapper: (value: R) => T, either: Either<L, R>): Either<L, T> =>
    bimap(x => x, mapper, either)

export const caseOf = <L, R, T>(either: Either<L, R>, patterns: EitherPatterns<L, R, T>): T =>
    isLeft(either) ? patterns.Left(either.value) : patterns.Right(either.value)

export const leftOrDefault = <L, R>(defaultValue: L, either: Either<L, R>): L =>
    isLeft(either) ? either.value : defaultValue

export const rightOrDefault = <L, R>(defaultValue: R, either: Either<L, R>): R =>
    isLeft(either) ? defaultValue : either.value

export const whenLeft = <L, R>(effect: (value: L) => void | undefined, either: Either<L, R>): Either<L, R> =>
    isLeft(either) ? (effect(either.value), either) : either

export const whenRight = <L, R>(effect: (value: R) => void | undefined, either: Either<L, R>): Either<L, R> =>
    isLeft(either) ? either : (effect(either.value), either)

export const leftToMaybe = <L, R>(either: Either<L, R>): Maybe<L> =>
    isLeft(either) ? Just(either.value) : Nothing

export const rightToMaybe = <L, R>(either: Either<L, R>): Maybe<R> =>
    isLeft(either) ? Nothing : Just(either.value)

export const liftA2 = <L, R, R2, R3>(mapper: (a: R, b: R2) => R3, eitherA: Either<L, R>, eitherB: Either<L, R2>): Either<L, R3> =>
    (isLeft(eitherA) || isLeft(eitherB)) ? eitherA as Either<L, R3> : Right(mapper(eitherA.value, eitherB.value))

export const lefts = <L, R>(list: Either<L, R>[]): L[] =>
    list.filter(isLeft).map(x => x.value)

export const rights = <L, R>(list: Either<L, R>[]): R[] =>
    list.filter(isRight).map(x => x.value)