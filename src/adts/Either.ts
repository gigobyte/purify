import { Show } from '../typeclasses/Show'
import { Unsafe } from '../typeclasses/Unsafe'
import { Maybe, Just, Nothing } from './Maybe'

export type EitherPatterns<L, R, T> =
  | { Left: (l: L) => T; Right: (r: R) => T }
  | { _: () => T }

export interface Either<L, R> extends Show, Unsafe {
  __value: L | R
  isLeft(): this is Either<L, never>
  isRight(): this is Either<never, R>
  toJSON(): L | R
  inspect(): string
  toString(): string
  bimap<L2, R2>(f: (value: L) => L2, g: (value: R) => R2): Either<L2, R2>
  map<R2>(f: (value: R) => R2): Either<L, R2>
  mapLeft<L2>(f: (value: L) => L2): Either<L2, R>
  ap<R2>(other: Either<L, (value: R) => R2>): Either<L, R2>
  equals(other: Either<L, R>): boolean
  chain<R2>(f: (value: R) => Either<L, R2>): Either<L, R2>
  join<R2>(this: Either<L, Either<L, R2>>): Either<L, R2>
  alt(other: Either<L, R>): Either<L, R>
  reduce<T>(reducer: (accumulator: T, value: R) => T, initialValue: T): T
  extend<R2>(f: (value: Either<L, R>) => R2): Either<L, R2>
  unsafeCoerce(): R
  caseOf<T>(patterns: EitherPatterns<L, R, T>): T
  leftOrDefault(defaultValue: L): L
  orDefault(defaultValue: R): R
  orDefaultLazy(getDefaultValue: () => R): R
  leftOrDefaultLazy(getDefaultValue: () => L): L
  ifLeft(effect: (value: L) => any): this
  ifRight(effect: (value: R) => any): this
  toMaybe(): Maybe<R>
  leftToMaybe(): Maybe<L>
  either<T>(ifLeft: (value: L) => T, ifRight: (value: R) => T): T
  extract(): L | R
}

interface EitherTypeRef {
  of<L, R>(value: R): Either<L, R>
  lefts<L, R>(list: Either<L, R>[]): L[]
  rights<L, R>(list: Either<L, R>[]): R[]
  encase<L extends Error, R>(throwsF: () => R): Either<L, R>
}

export const Either: EitherTypeRef = {
  of<L, R>(value: R): Either<L, R> {
    return Right(value)
  },
  lefts<L, R>(list: Either<L, R>[]): L[] {
    return list.filter(x => x.isLeft()).map(x => x.__value as L)
  },
  rights<L, R>(list: Either<L, R>[]): R[] {
    return list.filter(x => x.isRight()).map(x => x.__value as R)
  },
  encase<L extends Error, R>(throwsF: () => R): Either<L, R> {
    try {
      return Right(throwsF())
    } catch (e) {
      return Left(e)
    }
  }
}

export function Right<L, R>(value: R): Either<L, R> {
  return {
    __value: value,
    isLeft(): false {
      return false
    },
    isRight(): true {
      return true
    },
    toJSON(): R {
      return value
    },
    inspect(): string {
      return `Right(${value})`
    },
    toString(): string {
      return this.inspect()
    },
    bimap<L2, R2>(_: (value: L) => L2, g: (value: R) => R2): Either<L2, R2> {
      return Right(g(value))
    },
    map<R2>(f: (value: R) => R2): Either<L, R2> {
      return Right(f(value))
    },
    mapLeft<L2>(_: (value: L) => L2): Either<L2, R> {
      return this as any
    },
    ap<R2>(other: Either<L, (value: R) => R2>): Either<L, R2> {
      return other.isLeft() ? other : this.map(other.__value as any)
    },
    equals(other: Either<L, R>): boolean {
      return other.isRight() ? value === other.__value : false
    },
    chain<R2>(f: (value: R) => Either<L, R2>): Either<L, R2> {
      return f(value)
    },
    join<R2>(this: Either<L, Either<L, R2>>): Either<L, R2> {
      return value as any
    },
    alt(_: Either<L, R>): Either<L, R> {
      return this
    },
    reduce<T>(reducer: (accumulator: T, value: R) => T, initialValue: T): T {
      return reducer(initialValue, value)
    },
    extend<R2>(f: (value: Either<L, R>) => R2): Either<L, R2> {
      return Right(f(this))
    },
    unsafeCoerce(): R {
      return value
    },
    caseOf<T>(patterns: EitherPatterns<L, R, T>): T {
      return '_' in patterns ? patterns._() : patterns.Right(value)
    },
    leftOrDefault(defaultValue: L): L {
      return defaultValue
    },
    orDefault(_: R): R {
      return value
    },
    orDefaultLazy(_: () => R): R {
      return value
    },
    leftOrDefaultLazy(getDefaultValue: () => L): L {
      return getDefaultValue()
    },
    ifLeft(_: (value: L) => any): Either<L, R> {
      return this
    },
    ifRight(effect: (value: R) => any): Either<L, R> {
      return effect(value), this
    },
    toMaybe(): Maybe<R> {
      return Just(value)
    },
    leftToMaybe(): Maybe<L> {
      return Nothing
    },
    either<T>(_: (value: L) => T, ifRight: (value: R) => T): T {
      return ifRight(value)
    },
    extract(): L | R {
      return value
    }
  }
}

export function Left<L, R>(value: L): Either<L, R> {
  return {
    __value: value,
    isLeft(): true {
      return true
    },
    isRight(): false {
      return false
    },
    toJSON(): L {
      return value
    },
    inspect(): string {
      return `Left(${value})`
    },
    toString(): string {
      return this.inspect()
    },
    bimap<L2, R2>(f: (value: L) => L2, _: (value: R) => R2): Either<L2, R2> {
      return Left(f(value))
    },
    map<R2>(_: (value: R) => R2): Either<L, R2> {
      return this as any
    },
    mapLeft<L2>(f: (value: L) => L2): Either<L2, R> {
      return Left(f(value))
    },
    ap<R2>(other: Either<L, (value: R) => R2>): Either<L, R2> {
      return other.isLeft() ? other : (this as any)
    },
    equals(other: Either<L, R>): boolean {
      return other.isLeft() ? other.__value === value : false
    },
    chain<R2>(_: (value: R) => Either<L, R2>): Either<L, R2> {
      return this as any
    },
    join<R2>(this: Either<L, Either<L, R2>>): Either<L, R2> {
      return this as any
    },
    alt(other: Either<L, R>): Either<L, R> {
      return other
    },
    reduce<T>(_: (accumulator: T, value: R) => T, initialValue: T): T {
      return initialValue
    },
    extend<R2>(_: (value: Either<L, R>) => R2): Either<L, R2> {
      return this as any
    },
    unsafeCoerce(): never {
      throw new Error('Either got coerced to a Left')
    },
    caseOf<T>(patterns: EitherPatterns<L, R, T>): T {
      return '_' in patterns ? patterns._() : patterns.Left(value)
    },
    leftOrDefault(_: L): L {
      return value
    },
    orDefault(defaultValue: R): R {
      return defaultValue
    },
    orDefaultLazy(getDefaultValue: () => R): R {
      return getDefaultValue()
    },
    leftOrDefaultLazy(_: () => L): L {
      return value
    },
    ifLeft(effect: (value: L) => any): Either<L, R> {
      return effect(value), this
    },
    ifRight(_: (value: R) => any): Either<L, R> {
      return this
    },
    toMaybe(): Maybe<R> {
      return Nothing
    },
    leftToMaybe(): Maybe<L> {
      return Just(value)
    },
    either<T>(ifLeft: (value: L) => T, _: (value: R) => T): T {
      return ifLeft(value)
    },
    extract(): L | R {
      return value
    }
  }
}
