import { Either, Left, Right } from './Either'

export type MaybePatterns<T, U> =
  | { Just: (value: T) => U; Nothing: () => U }
  | { _: () => U }

interface AlwaysJust {
  kind: '$$MaybeAlwaysJust'
}

type ExtractMaybe<T, TDefault> = T extends never ? TDefault : T | TDefault

export interface Maybe<T> {
  /** Returns true if `this` is `Just`, otherwise it returns false */
  isJust(): this is AlwaysJust
  /** Returns true if `this` is `Nothing`, otherwise it returns false */
  isNothing(): this is Nothing
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
  /** Lazy version of `alt` */
  altLazy(other: () => Maybe<T>): Maybe<T>
  /** Transforms `this` with a function that returns a `Maybe`. Useful for chaining many computations that may result in a missing value */
  chain<U>(f: (value: T) => Maybe<U>): Maybe<U>
  /** Transforms `this` with a function that returns a nullable value. Equivalent to `m.chain(x => Maybe.fromNullable(f(x)))` */
  chainNullable<U>(f: (value: T) => U | undefined | null | void): Maybe<U>
  /** Flattens nested Maybes. `m.join()` is equivalent to `m.chain(x => x)` */
  join<U>(this: Maybe<Maybe<U>>): Maybe<U>
  /** Takes a reducer and an initial value and returns the initial value if `this` is `Nothing` or the result of applying the function to the initial value and the value inside `this` */
  reduce<U>(reducer: (accumulator: U, value: T) => U, initialValue: U): U
  /** Returns `this` if it's `Nothing`, otherwise it returns the result of applying the function argument to `this` and wrapping it in a `Just` */
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
  extract(): this extends AlwaysJust ? T : ExtractMaybe<T, undefined>
  /** Returns the value inside `this` or null if `this` is `Nothing`. Use `extract` if you need an undefined returned instead */
  extractNullable(): this extends AlwaysJust ? T : ExtractMaybe<T, null>
  /** Constructs a `Right` from a `Just` or a `Left` with a provided left value if `this` is `Nothing` */
  toEither<L>(left: L): Either<L, T>
  /** Runs an effect if `this` is `Just`, returns `this` to make chaining other methods possible */
  ifJust(effect: (value: T) => any): this
  /** Runs an effect if `this` is `Nothing`, returns `this` to make chaining other methods possible */
  ifNothing(effect: () => any): this
  /** Takes a predicate function and returns `this` if the predicate returns true or Nothing if it returns false */
  filter<U extends T>(pred: (value: T) => value is U): Maybe<U>
  /** Takes a predicate function and returns `this` if the predicate returns true or Nothing if it returns false */
  filter(pred: (value: T) => boolean): Maybe<T>

  'fantasy-land/equals'(other: Maybe<T>): boolean
  'fantasy-land/map'<U>(f: (value: T) => U): Maybe<U>
  'fantasy-land/ap'<U>(maybeF: Maybe<(value: T) => U>): Maybe<U>
  'fantasy-land/alt'(other: Maybe<T>): Maybe<T>
  'fantasy-land/chain'<U>(f: (value: T) => Maybe<U>): Maybe<U>
  'fantasy-land/reduce'<U>(
    reducer: (accumulator: U, value: T) => U,
    initialValue: U
  ): U
  'fantasy-land/extend'<U>(f: (value: Maybe<T>) => U): Maybe<U>
  'fantasy-land/filter'<U extends T>(pred: (value: T) => boolean): Maybe<U>
  'fantasy-land/filter'(pred: (value: T) => boolean): Maybe<T>
}

interface MaybeTypeRef {
  /** Takes a value and wraps it in a `Just` */
  of<T>(value: T): Maybe<T>
  /** Returns `Nothing` */
  empty(): Nothing
  /** Returns `Nothing` */
  zero(): Nothing

  /** Takes a value and returns `Nothing` if the value is null or undefined, otherwise a `Just` is returned */
  fromNullable<T>(value: T | undefined | null | void): Maybe<T>
  /** Takes a value and returns Nothing if the value is falsy, otherwise a Just is returned */
  fromFalsy<T>(value: T | undefined | null | void): Maybe<T>
  /** Takes a predicate and a value, passes the value to the predicate and returns a Just if it returns true, otherwise a Nothing is returned */
  fromPredicate<T>(pred: (value: T) => boolean): (value: T) => Maybe<T>
  fromPredicate<T>(pred: (value: T) => boolean, value: T): Maybe<T>
  /** Returns only the `Just` values in a list */
  catMaybes<T>(list: readonly Maybe<T>[]): T[]
  /** Maps over a list of values and returns a list of all resulting `Just` values */
  mapMaybe<T, U>(f: (value: T) => Maybe<U>): (list: readonly T[]) => U[]
  mapMaybe<T, U>(f: (value: T) => Maybe<U>, list: readonly T[]): U[]
  /** Calls a function that may throw and wraps the result in a `Just` if successful or `Nothing` if an error is caught */
  encase<T>(thunk: () => T): Maybe<T>
  isMaybe<T>(x: unknown): x is Maybe<T>
  /** Turns a list of `Maybe`s into an `Maybe` of list if all items are `Just` */
  sequence<T>(maybes: readonly Maybe<T>[]): Maybe<T[]>

  'fantasy-land/of'<T>(value: T): Maybe<T>
  'fantasy-land/empty'(): Nothing
  'fantasy-land/zero'(): Nothing
}

export const Maybe: MaybeTypeRef = {
  of<T>(value: T): Maybe<T> {
    return just(value)
  },
  empty(): Nothing {
    return nothing
  },
  zero(): Nothing {
    return nothing
  },
  fromNullable<T>(value: T | undefined | null | void): Maybe<T> {
    return value == null ? nothing : just(value)
  },
  fromFalsy<T>(value: T | undefined | null | void): Maybe<T> {
    return value ? just(value) : nothing
  },
  fromPredicate<T>(pred: (value: T) => boolean, value?: T): any {
    switch (arguments.length) {
      case 1:
        return (value: T) => Maybe.fromPredicate(pred, value)
      default:
        return pred(value!) ? just(value!) : nothing
    }
  },
  mapMaybe<T, U>(f: (value: T) => Maybe<U>, list?: readonly T[]): any {
    switch (arguments.length) {
      case 1:
        return (list: T[]) => Maybe.mapMaybe(f, list)
      default:
        return Maybe.catMaybes(list!.map(f))
    }
  },
  catMaybes<T>(list: readonly Maybe<T>[]): T[] {
    let res: T[] = []

    for (const e of list) {
      if (e.isJust()) {
        res.push(e.extract())
      }
    }

    return res
  },
  encase<T>(thunk: () => T): Maybe<T> {
    try {
      return just(thunk())
    } catch {
      return nothing
    }
  },
  isMaybe<T>(x: unknown): x is Maybe<T> {
    return x instanceof Just || x instanceof Nothing
  },
  sequence<T>(maybes: readonly Maybe<T>[]): Maybe<T[]> {
    let res: T[] = []

    for (const m of maybes) {
      if (m.isJust()) {
        res.push(m.extract())
      } else {
        return nothing
      }
    }

    return just(res)
  },

  'fantasy-land/of'<T>(value: T): Maybe<T> {
    return this.of(value)
  },
  'fantasy-land/empty'(): Nothing {
    return this.empty()
  },
  'fantasy-land/zero'(): Nothing {
    return this.zero()
  }
}

class Just<T> implements Maybe<T> {
  constructor(private __value: T) {}

  isJust(): boolean {
    return true
  }

  isNothing(): boolean {
    return false
  }

  inspect(): string {
    return `Just(${this.__value})`
  }

  toString(): string {
    return this.inspect()
  }

  toJSON(): T {
    const value: any = this.__value
    return value instanceof Date ? value.toJSON() : value
  }

  equals(other: Maybe<T>): boolean {
    return this.extract() === other.extract()
  }

  map<U>(f: (value: T) => U): Maybe<U> {
    return just(f(this.__value))
  }

  ap<U>(maybeF: Maybe<(value: T) => U>): Maybe<U> {
    return maybeF.isJust() ? this.map(maybeF.extract()) : nothing
  }

  alt(_: Maybe<T>): Maybe<T> {
    return this
  }

  altLazy(_: () => Maybe<T>): Maybe<T> {
    return this
  }

  chain<U>(f: (value: T) => Maybe<U>): Maybe<U> {
    return f(this.__value)
  }

  chainNullable<U>(f: (value: T) => U | undefined | null | void): Maybe<U> {
    return Maybe.fromNullable(f(this.__value))
  }

  join<U>(this: Just<Maybe<U>>): Maybe<U> {
    return this.__value
  }

  reduce<U>(reducer: (accumulator: U, value: T) => U, initialValue: U): U {
    return reducer(initialValue, this.__value)
  }

  extend<U>(f: (value: Maybe<T>) => U): Maybe<U> {
    return just(f(this))
  }

  unsafeCoerce(): T {
    return this.__value
  }

  caseOf<U>(patterns: MaybePatterns<T, U>): U {
    return '_' in patterns ? patterns._() : patterns.Just(this.__value)
  }

  orDefault(_: T) {
    return this.__value
  }

  orDefaultLazy(_: () => T): T {
    return this.__value
  }

  toList(): T[] {
    return [this.__value]
  }

  mapOrDefault<U>(f: (value: T) => U, _: U): U {
    return f(this.__value)
  }

  extract(): this extends AlwaysJust ? T : ExtractMaybe<T, undefined> {
    return this.__value as this extends AlwaysJust
      ? T
      : ExtractMaybe<T, undefined>
  }

  extractNullable(): this extends AlwaysJust ? T : ExtractMaybe<T, null> {
    return this.__value as this extends AlwaysJust ? T : ExtractMaybe<T, null>
  }

  toEither<L>(_: L): Either<L, T> {
    return Right(this.__value)
  }

  ifJust(effect: (value: T) => any): this {
    return effect(this.__value), this
  }

  ifNothing(_: () => any): this {
    return this
  }

  filter<U extends T>(pred: (value: T) => value is U): Maybe<U>
  filter(pred: (value: T) => boolean): Maybe<T>
  filter(pred: (value: T) => boolean) {
    return pred(this.__value) ? just(this.__value) : nothing
  }

  'fantasy-land/equals' = this.equals
  'fantasy-land/map' = this.map
  'fantasy-land/ap' = this.ap
  'fantasy-land/alt' = this.alt
  'fantasy-land/chain' = this.chain
  'fantasy-land/reduce' = this.reduce
  'fantasy-land/extend' = this.extend
  'fantasy-land/filter' = this.filter
}

Just.prototype.constructor = Maybe as any

class Nothing implements Maybe<never> {
  private __value!: never

  isJust() {
    return false
  }

  isNothing() {
    return true
  }

  inspect(): string {
    return 'Nothing'
  }

  toString(): string {
    return this.inspect()
  }

  toJSON(): never {
    return this.__value
  }

  equals<T>(other: Maybe<T>): boolean {
    return this.extract() === other.extract()
  }

  map<U>(_: (value: never) => U): Maybe<U> {
    return nothing
  }

  ap<U>(_: Maybe<(value: never) => U>): Maybe<U> {
    return nothing
  }

  alt<T>(other: Maybe<T>): Maybe<T> {
    return other
  }

  altLazy<T>(other: () => Maybe<T>): Maybe<T> {
    return other()
  }

  chain<U>(_: (value: never) => Maybe<U>): Maybe<U> {
    return nothing
  }

  chainNullable<U>(_: (value: never) => U | undefined | null | void): Maybe<U> {
    return nothing
  }

  join<U>(this: Maybe<Maybe<U>>): Maybe<U> {
    return nothing
  }

  reduce<U>(_: (accumulator: U, value: never) => U, initialValue: U): U {
    return initialValue
  }

  extend<U>(_: (value: Maybe<never>) => U): Maybe<U> {
    return nothing
  }

  unsafeCoerce<T>(): T {
    throw new Error('Maybe#unsafeCoerce was ran on a Nothing')
  }

  caseOf<U>(patterns: MaybePatterns<never, U>): U {
    return '_' in patterns ? patterns._() : patterns.Nothing()
  }

  orDefault<T>(defaultValue: T): T {
    return defaultValue
  }

  orDefaultLazy<T>(getDefaultValue: () => T): T {
    return getDefaultValue()
  }

  toList<T>(): T[] {
    return []
  }

  mapOrDefault<U>(_: (value: never) => U, defaultValue: U): U {
    return defaultValue
  }

  extract(): this extends AlwaysJust ? never : ExtractMaybe<never, undefined> {
    return undefined as this extends AlwaysJust
      ? never
      : ExtractMaybe<never, undefined>
  }

  extractNullable(): this extends AlwaysJust
    ? never
    : ExtractMaybe<never, null> {
    return null as this extends AlwaysJust ? never : ExtractMaybe<never, null>
  }

  toEither<L, T>(left: L): Either<L, T> {
    return Left(left)
  }

  ifJust(_: (value: never) => any): this {
    return this
  }

  ifNothing(effect: () => any): this {
    return effect(), this
  }

  filter(_: (value: never) => boolean): Maybe<never> {
    return nothing
  }

  'fantasy-land/equals' = this.equals
  'fantasy-land/map' = this.map
  'fantasy-land/ap' = this.ap
  'fantasy-land/alt' = this.alt
  'fantasy-land/chain' = this.chain
  'fantasy-land/reduce' = this.reduce
  'fantasy-land/extend' = this.extend
  'fantasy-land/filter' = this.filter
}

Nothing.prototype.constructor = Maybe as any

/** Constructs a Just. Represents an optional value that exists */
const just = <T>(value: T): Maybe<T> => new Just(value)

/** Represents a missing value, you can think of it as a smart 'null' */
const nothing = new Nothing()

export { just as Just, nothing as Nothing }
