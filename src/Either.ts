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

export const of = <T>(value: T): Right<T> =>
    Right(value)

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