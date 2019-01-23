import { Either, Left, Right } from './Either'
import { Show } from '../typeclasses/Show'
import { Unsafe } from '../typeclasses/Unsafe'

export type MaybePatterns<T, U> =
  | { Just: (value: T) => U; Nothing: () => U }
  | { _: () => U }

interface AlwaysJust {
  kind: '$$MaybeAlwaysJust'
}

export interface Maybe<T> extends Show, Unsafe {
  /** Internal property and subject to breaking changes, please use some of the available methods on the object if you want to access it */
  __value: T
  /** Returns true if `this` is `Just`, otherwise it returns false */
  isJust(): this is AlwaysJust
  /** Returns true if `this` is `Nothing`, otherwise it returns false */
  isNothing(): this is typeof Nothing
  inspect(): string
  toString(): string
  toJSON(): T
  /** Compares the values inside `this` and the argument, returns true if both are Nothing or if the values are equal */
  equals(other: Maybe<T>): boolean
  /** Transforms the value inside `this` with a given function. Returns `Nothing` if `this` is `Nothing` */
  map<U>(f: (value: T) => U): Maybe<U>
  /** Maps `this` with a `Maybe` function */
  ap<U>(maybeF: Maybe<(value: T) => U>): Maybe<U>
  /** Returns the first `Just` between `this` and another `Maybe` or `Nothing` if both `this` and the argument are `Nothing` */
  alt(other: Maybe<T>): Maybe<T>
  /** Transforms `this` with a function that returns a `Maybe`. Useful for chaining many computations that may result in a missing value */
  chain<U>(f: (value: T) => Maybe<U>): Maybe<U>
  /** Transforms `this` with a function that returns a nullable value. Equivalent to `m.chain(x => Maybe.fromNullable(f(x)))` */
  chainNullable<U>(f: (value: T) => U | undefined | null | void): Maybe<U>
  /** Flattens nested Maybes. `m.join()` is equivalent to `m.chain(x => x)` */
  join<U>(this: Maybe<Maybe<U>>): Maybe<U>
  /** Takes a reducer and a initial value and returns the initial value if `this` is `Nothing` or the result of applying the function to the initial value and the value inside `this` */
  reduce<U>(reducer: (accumulator: U, value: T) => U, initialValue: U): U
  /** Returns `this` if it\'s `Nothing`, otherwise it returns the result of applying the function argument to `this` and wrapping it in a `Just` */
  extend<U>(f: (value: Maybe<T>) => U): Maybe<U>
  /** Returns the value inside `this` or throws an error if `this` is `Nothing` */
  unsafeCoerce(): T
  /** Structural pattern matching for `Maybe` in the form of a function */
  caseOf<U>(patterns: MaybePatterns<T, U>): U
  /** Returns the default value if `this` is `Nothing`, otherwise it return the value inside `this` */
  orDefault(defaultValue: T): T
  /** Lazy version of `orDefault`. Takes a function that returns the default value, that function will be called only if `this` is `Nothing` */
  orDefaultLazy(getDefaultValue: () => T): T
  /** Returns empty list if the `Maybe` is `Nothing` or a list where the only element is the value of `Just` */
  toList(): T[]
  /** Maps over `this` and returns the resulting value or returns the default value if `this` is `Nothing` */
  mapOrDefault<U>(f: (value: T) => U, defaultValue: U): U
  /** Returns the value inside `this` or undefined if `this` is `Nothing`. Use `extractNullable` if you need a null returned instead */
  extract(): this extends AlwaysJust ? T : T | undefined
  /** Returns the value inside `this` or null if `this` is `Nothing`. Use `extract` if you need an undefined returned instead */
  extractNullable(): this extends AlwaysJust ? T : T | null
  /** Constructs a `Right` from a `Just` or a `Left` with a provided left value if `this` is `Nothing` */
  toEither<L>(left: L): Either<L, T>
  /** Runs an effect if `this` is `Just`, returns `this` to make chaining other methods possible */
  ifJust(effect: (value: T) => any): this
  /** Runs an effect if `this` is `Nothing`, returns `this` to make chaining other methods possible */
  ifNothing(effect: () => any): this
  /** Takes a predicate function and returns `this` if the predicate returns true or Nothing if it returns false */
  filter(pred: (value: T) => boolean): Maybe<T>
}

interface MaybeTypeRef {
  /** Takes a value and wraps it in a `Just` */
  of<T>(value: T): Maybe<T>
  /** Returns `Nothing` */
  empty(): typeof Nothing
  /** Returns `Nothing` */
  zero(): typeof Nothing

  /** Takes a value and returns `Nothing` if the value is null or undefined, otherwise a `Just` is returned */
  fromNullable<T>(value: T | undefined | null | void): Maybe<T>
  /** Takes a value and returns Nothing if the value is falsy, otherwise a Just is returned */
  fromFalsy<T>(value: T | undefined | null | void): Maybe<T>
  /** Takes a predicate and a value, passes the value to the predicate and returns a Just if it returns true, otherwise a Nothing is returned */
  fromPredicate<T>(pred: (value: T) => boolean): (value: T) => Maybe<T>
  fromPredicate<T>(pred: (value: T) => boolean, value: T): Maybe<T>
  /** Returns only the `Just` values in a list */
  catMaybes<T>(list: Maybe<T>[]): T[]
  /** Maps over a list of values and returns a list of all resulting `Just` values */
  mapMaybe<T, U>(f: (value: T) => Maybe<U>): (list: T[]) => U[]
  mapMaybe<T, U>(f: (value: T) => Maybe<U>, list: T[]): U[]
  /** Calls a function that may throw and wraps the result in a `Just` if successful or `Nothing` if an error is caught */
  encase<T>(thunk: () => T): Maybe<T>
}

export const Maybe: MaybeTypeRef = {
  of<T>(value: T): Maybe<T> {
    return Just(value)
  },
  empty(): typeof Nothing {
    return Nothing
  },
  zero(): typeof Nothing {
    return Nothing
  },
  fromNullable<T>(value: T | undefined | null | void): Maybe<T> {
    return value == null ? Nothing : Just(value)
  },
  fromFalsy<T>(value: T | undefined | null | void): Maybe<T> {
    return value ? Just(value) : Nothing
  },
  fromPredicate<T>(pred: (value: T) => boolean, value?: T): any {
    switch (arguments.length) {
      case 1:
        return (value: T) => Maybe.fromPredicate(pred, value)
      default:
        return pred(value!) ? Just(value!) : Nothing
    }
  },
  mapMaybe<T, U>(f: (value: T) => Maybe<U>, list?: T[]): any {
    switch (arguments.length) {
      case 1:
        return (list: T[]) => Maybe.mapMaybe(f, list)
      default:
        return Maybe.catMaybes(list!.map(f))
    }
  },
  catMaybes<T>(list: Maybe<T>[]): T[] {
    return list.filter(x => x.isJust()).map(x => x.__value)
  },
  encase<T>(thunk: () => T): Maybe<T> {
    try {
      return Just(thunk())
    } catch {
      return Nothing
    }
  }
}

/** Constructs a Just. Respents an optional value that exists. */
export function Just<T>(value: T): Maybe<T> {
  return {
    __value: value,
    isJust: () => {
      return true
    },
    isNothing: () => {
      return false
    },
    inspect(): string {
      return `Just(${value})`
    },
    toString(): string {
      return this.inspect()
    },
    toJSON(): T {
      return value
    },
    equals(other: Maybe<T>): boolean {
      return value === other.__value
    },
    map<U>(f: (value: T) => U): Maybe<U> {
      return Just(f(value))
    },
    ap<U>(maybeF: Maybe<(value: T) => U>): Maybe<U> {
      return maybeF.isNothing() ? Nothing : this.map(maybeF.__value)
    },
    alt(_: Maybe<T>): Maybe<T> {
      return this
    },
    chain<U>(f: (value: T) => Maybe<U>): Maybe<U> {
      return f(value)
    },
    chainNullable<U>(f: (value: T) => U | undefined | null | void): Maybe<U> {
      return Maybe.fromNullable(f(value))
    },
    join<U>(this: Maybe<Maybe<U>>): Maybe<U> {
      return this.__value
    },
    reduce<U>(reducer: (accumulator: U, value: T) => U, initialValue: U): U {
      return reducer(initialValue, value)
    },
    extend<U>(f: (value: Maybe<T>) => U): Maybe<U> {
      return Just(f(this))
    },
    unsafeCoerce(): T {
      return value
    },
    caseOf<U>(patterns: MaybePatterns<T, U>): U {
      return '_' in patterns ? patterns._() : patterns.Just(value)
    },
    orDefault(_: T): T {
      return value
    },
    orDefaultLazy(_: () => T): T {
      return value
    },
    toList(): T[] {
      return [value]
    },
    mapOrDefault<U>(f: (value: T) => U, _: U): U {
      return f(value)
    },
    extract(): T {
      return value
    },
    extractNullable(): T {
      return value
    },
    toEither<L>(_: L): Either<L, T> {
      return Right(value)
    },
    ifJust(effect: (value: T) => any): Maybe<T> {
      return effect(value), this
    },
    ifNothing(_: () => any): Maybe<T> {
      return this
    },
    filter(pred: (value: T) => boolean): Maybe<T> {
      return pred(value) ? Just(value) : Nothing
    }
  }
}

/** Represents a missing value, you can think of it as a smart 'null'. */
export const Nothing: Maybe<never> = {
  __value: null as never,
  isJust: () => {
    return false
  },
  isNothing: () => {
    return true
  },
  inspect(): string {
    return 'Nothing'
  },
  toString(): string {
    return this.inspect()
  },
  toJSON(): never {
    return this.__value
  },
  equals<T>(other: Maybe<T>): boolean {
    return this.__value === other.__value
  },
  map<T, U>(_: (value: T) => U): Maybe<U> {
    return Nothing
  },
  ap<T, U>(_: Maybe<(value: T) => U>): Maybe<U> {
    return Nothing
  },
  alt<T>(other: Maybe<T>): Maybe<T> {
    return other
  },
  chain<T, U>(_: (value: T) => Maybe<U>): Maybe<U> {
    return Nothing
  },
  chainNullable<T, U>(_: (value: T) => U | undefined | null | void): Maybe<U> {
    return Nothing
  },
  join<U>(this: Maybe<Maybe<U>>): Maybe<U> {
    return Nothing
  },
  reduce<U>(_: (accumulator: U, value: never) => U, initialValue: U): U {
    return initialValue
  },
  extend<T, U>(_: (value: Maybe<T>) => U): Maybe<U> {
    return Nothing
  },
  unsafeCoerce<T>(): T {
    throw new Error('Maybe got coerced to a null')
  },
  caseOf<U>(patterns: MaybePatterns<never, U>): U {
    return '_' in patterns ? patterns._() : patterns.Nothing()
  },
  orDefault<T>(defaultValue: T): T {
    return defaultValue
  },
  orDefaultLazy<T>(getDefaultValue: () => T): T {
    return getDefaultValue()
  },
  toList<T>(): T[] {
    return []
  },
  mapOrDefault<T, U>(_: (value: T) => U, defaultValue: U): U {
    return defaultValue
  },
  extract(): undefined {
    return undefined
  },
  extractNullable(): null {
    return null
  },
  toEither<L, T>(left: L): Either<L, T> {
    return Left(left)
  },
  ifJust<T>(_: (value: T) => any): Maybe<T> {
    return this
  },
  ifNothing<T>(effect: () => any): Maybe<T> {
    return effect(), this
  },
  filter<T>(_: (value: T) => boolean): Maybe<T> {
    return Nothing
  }
}
