import { Either, Left, Right } from './Either'
import { Show } from '../typeclasses/Show'
import { Setoid } from '../typeclasses/Setoid'
import { Ord } from '../typeclasses/Ord'
import { Semigroup } from '../typeclasses/Semigroup'
import { Monoid } from '../typeclasses/Monoid'
import { Functor } from '../typeclasses/Functor'
import { Apply } from '../typeclasses/Apply'
import { Applicative } from '../typeclasses/Applicative'
import { Plus } from '../typeclasses/Plus'
import { Alt } from '../typeclasses/Alt'
import { Alternative } from '../typeclasses/Alternative'
import { Chain } from '../typeclasses/Chain'
import { Monad } from '../typeclasses/Monad'
import { Foldable } from '../typeclasses/Foldable'
import { Extend } from '../typeclasses/Extend'
import { Unsafe } from '../typeclasses/Unsafe'
import concat from '../utils/concat'

export type MaybePatterns<T, U> = {Just: (value: T) => U, Nothing: () => U}

export class Maybe<T> implements Show, Setoid<Maybe<T>>, Ord<Maybe<T>>, Semigroup<Maybe<T>>, Monoid<Maybe<T>>, Functor<T>, Apply<T>, Applicative<T>, Alt<T>, Plus<T>, Alternative<T>, Chain<T>, Monad<T>, Foldable<T>, Extend<T>, Unsafe {
    constructor(public readonly value: T) {}
    __tag: 'Maybe' = 'Maybe'

    readonly of = Maybe.of
    readonly zero = Maybe.zero
    readonly empty = Maybe.empty
    readonly 'fantasy-land/alt' = this.alt
    readonly 'fantasy-land/of' = this.of
    readonly 'fantasy-land/ap' = this.ap
    readonly 'fantasy-land/chain' = this.chain
    readonly 'fantasy-land/reduce' = this.reduce
    readonly 'fantasy-land/map' = this.map
    readonly 'fantasy-land/lte' = this.lte
    readonly 'fantasy-land/zero' = this.zero
    readonly 'fantasy-land/extend' = this.extend
    readonly 'fantasy-land/concat' = this.concat
    readonly 'fantasy-land/empty' = this.empty
    readonly 'fantasy-land/equals' = this.equals

    /** Takes a value and wraps it in a `Just` */
    static of<T>(value: T): Maybe<T> {
        return Just(value)
    }

    /** Takes a value and returns `Nothing` if the value is null or undefined, otherwise a `Just` is returned */
    static toMaybe<T>(value: T): Maybe<T> {
        return value == null ? Nothing : Just(value)
    }

    static toMaybeWeak<T>(value: T): Maybe<T> {
        return value ? Just(value) : Nothing
    }

    /** Returns `Nothing` */
    static empty(): typeof Nothing {
        return Nothing
    }

    /** Returns `Nothing` */
    static zero(): typeof Nothing  {
        return Nothing
    }

    /** Returns only the `Just` values in a list */
    static catMaybes<T>(list: Maybe<T>[]): T[] {
        return list.filter(x => x.isJust()).map(x => x.value)
    }

    /** Maps over a list of values and returns a list of all resulting `Just` values */
    static mapMaybe<T, U>(f: (value: T) => Maybe<U>): (list: T[]) => U[]
    static mapMaybe<T, U>(f: (value: T) => Maybe<U>, list: T[]): U[]
    static mapMaybe<T, U>(f: (value: T) => Maybe<U>, list?: T[]): any {
        if (!list) {
            return (list: T[]) => Maybe.catMaybes(list.map(f))
        }

        return Maybe.catMaybes(list.map(f))
    }

    /** Calls a function that may throw and wraps the result in a `Just` if successful or `Nothing` if an error is caught */
    static encase<T>(throwsF: () => T): Maybe<T> {
        try {
            return Just(throwsF())
        } catch {
            return Nothing
        }
    }

    /** Returns true if `this` is `Just`, otherwise it returns false */
    isJust(): boolean {
        return this.value !== null
    }

    /** Returns true if `this` is `Nothing`, otherwise it returns false */
    isNothing(): this is typeof Nothing {
        return this.value == null
    }

    inspect(): string {
        return this.value != null ? this.value.toString() : JSON.stringify(this.value)
    }

    toString(): string {
        return this.inspect()
    }

    toJSON(): T {
        return this.value
    }

    /** Compares the values inside `this` and the argument, returns true if both are Nothing or if the values are equal */
    equals(other: Maybe<T>): boolean {
        return this.value === other.value
    }

    /** Compares the values inside `this` and the argument, returns true if `this` is Nothing or if the value inside `this` is less than or equal to the value of the argument */
    lte(other: Maybe<T>): boolean {
        return this.isNothing() || this.value <= other.value
    }

    /** Concatenates a value inside a `Maybe` to the value inside `this` */
    concat(other: Maybe<T>): Maybe<T> {
        if (this.isNothing() && other.isNothing()) {
            return Nothing
        }

        if (this.isJust() && other.isJust()) {
            return Just(concat(this.value, other.value))
        }

        return this.alt(other)
    }

    /** Transforms the value inside `this` with a given function. Returns `Nothing` if `this` is `Nothing` */
    map<U>(f: (value: T) => U): Maybe<U> {
        return this.isNothing() ? Nothing : Just(f(this.value))
    }

    /** Maps `this` with a `Maybe` function */
    ap<U>(maybeF: Maybe<(value: T) => U>): Maybe<U> {
        return maybeF.isNothing() ? Nothing : this.map(maybeF.value)
    }

    /** Returns the first `Just` between `this` and another `Maybe` or `Nothing` if both `this` and the argument are `Nothing` */
    alt(other: Maybe<T>): Maybe<T> {
        return this.isNothing() ? other : this
    }

    /** Transforms `this` with a function that returns a `Maybe`. Useful for chaining many computations that may fail */
    chain<U>(f: (value: T) => Maybe<U>): Maybe<U> {
        return this.isNothing() ? Nothing : f(this.value)
    }

    /** Takes a reducer and a initial value and returns the initial value if `this` is `Nothing` or the result of applying the function to the initial value and the value inside `this` */
    reduce<U>(reducer: (accumulator: U, value: T) => U, initialValue: U): U {
        return this.isNothing() ? initialValue : reducer(initialValue, this.value)
    }

    /** Returns `this` if it\'s `Nothing`, otherwise it returns the result of applying the function argument to `this` and wrapping it in a `Just` */
    extend<U>(f: (value: Maybe<T>) => U): Maybe<U> {
        return this.isNothing() ? Nothing : Just(f(this))
    }

    /** Returns the value inside `this` or throws an error if `this` is `Nothing` */
    unsafeCoerce(): T {
        return this.isNothing() ? (() => { throw new Error('Maybe got coerced to a null') })() : this.value
    }

    /** Structural pattern matching for `Maybe` in the form of a function */
    caseOf<U>(patterns: MaybePatterns<T, U>): U {
        return this.isNothing() ? patterns.Nothing() : patterns.Just(this.value)
    }

    /** Returns the default value if `this` is `Nothing`, otherwise it unwraps `this` and returns the value */
    orDefault(defaultValue: T): T {
        return this.isNothing() ? defaultValue : this.value
    }

    /** Returns empty list if the `Maybe` is `Nothing` or a list where the only element is the value of `Just` */
    toList(): T[] {
        return this.isNothing() ? [] : [this.value]
    }

    /** Maps over `this` and returns the resulting value or returns the default value if `this` is `Nothing` */
    mapOrDefault<U>(f: (value: T) => U, defaultValue: U): U {
        return this.map(f).orDefault(defaultValue)
    }

    /** Returns the value inside `this` or null if `this` is `Nothing` */
    extract(): T | null {
        return this.value
    }

    /** Constructs a `Right` from a `Just` or a `Left` with a provided left value if `this` is `Nothing` */
    toEither<L>(left: L): Either<L, T> {
        return this.isNothing() ? Left(left) : Right(this.value)
    }

    /** Runs an effect if `this` is `Just`, returns `this` for easier composiblity */
    ifJust(effect: (value: T) => any): this {
        return this.isJust() ? (effect(this.value), this) : this
    }

    /** Runs an effect if `this` is `Nothing`, returns `this` for easier composiblity */
    ifNothing(effect: () => any): this {
        return this.isNothing() ? (effect(), this) : this
    }

    filter(pred: (value: T) => boolean): Maybe<T> {
        if (this.isNothing()) {
            return Nothing
        }

        return pred(this.value) ? Just(this.value) : Nothing
    }
}

/** Constructs a Just */
export const Just = <T>(value: T): Maybe<T> =>
    new Maybe(value)

/** Exported Nothing */
export const Nothing: Maybe<never> =
    new Maybe(null as never)