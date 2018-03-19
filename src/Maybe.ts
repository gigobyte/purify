import Show from 'typeclasses/Show'
import Setoid from 'typeclasses/Setoid'
import Ord from 'typeclasses/Ord'
import Semigroup, { concat } from 'typeclasses/Semigroup'
import Monoid from 'typeclasses/Monoid'
import Functor from 'typeclasses/Functor'
import Apply from 'typeclasses/Apply'
import Applicative from 'typeclasses/Applicative'
import Plus from 'typeclasses/Plus'
import Alt from 'typeclasses/Alt'
import Alternative from 'typeclasses/Alternative'
import Chain from 'typeclasses/Chain'
import Monad from 'typeclasses/Monad'
import Foldable from 'typeclasses/Foldable'
import Extend from 'typeclasses/Extend'
import Unsafe from 'typeclasses/Unsafe'

export type MaybePatterns<T, U> = {Just: (value: T) => U, Nothing: () => U}

export default class Maybe<T> implements Show, Setoid<T>, Ord<T>, Semigroup<T>, Monoid<T>, Functor<T>, Apply<T>, Applicative<T>, Alt<T>, Plus<T>, Alternative<T>, Chain<T>, Monad<T>, Foldable<T>, Extend<T>, Unsafe {
    constructor(public value: T) {}

    of = Maybe.of
    zero = Maybe.zero
    empty = Maybe.empty
    'fantasy-land/alt' = this.alt
    'fantasy-land/of' = this.of
    'fantasy-land/ap' = this.ap
    'fantasy-land/chain' = this.chain
    'fantasy-land/reduce' = this.reduce
    'fantasy-land/map' = this.map
    'fantasy-land/lte' = this.lte
    'fantasy-land/zero' = this.zero
    'fantasy-land/extend' = this.extend
    'fantasy-land/concat' = this.concat
    'fantasy-land/empty' = this.empty
    'fantasy-land/equals' = this.equals

    static of<T>(value: T): Maybe<T> {
        return Just(value)
    }

    static toMaybe<T>(value: T | null | undefined | void): Maybe<T> {
        return value == null ? Nothing : Just(value)
    }

    static falsyToMaybe<T>(value: T): Maybe<T> {
        return value ? Just(value) : Nothing
    }

    static empty(): typeof Nothing {
        return Nothing
    }

    static zero(): typeof Nothing  {
        return Nothing
    }

    static catMaybes<T>(list: Maybe<T>[]): T[] {
        return list.filter(x => x.isJust()).map(x => x.value)
    }

    static mapMaybe<T, U>(f: (value: T) => Maybe<U>, list: T[]): U[] {
        return Maybe.catMaybes(list.map(f))
    }

    static encase<T>(throwsF: () => T): Maybe<T> {
        try {
            return Just(throwsF())
        } catch {
            return Nothing
        }
    }

    isJust(): this is T {
        return this.value !== null
    }

    isNothing(): this is null {
        return this.value == null
    }

    inspect(): string {
        return this.value ? this.value.toString() : JSON.stringify(this.value)
    }

    toString(): string {
        return this.inspect()
    }

    toJSON(): T {
        return this.value
    }

    equals(other: Maybe<T>): boolean {
        return this.value === other.value
    }

    lte(other: Maybe<T>): boolean {
        return this.isNothing() || this.value > other.value
    }

    concat(other: Maybe<T>): Maybe<T> {
        if (this.isNothing() && other.isNothing()) {
            return Nothing
        }

        if (this.isJust() && other.isJust()) {
            return Just(concat(this.value, other.value))
        }

        return this.alt(other)
    }

    map<U>(f: (value: T) => U): Maybe<U> {
        return this.isNothing() ? Nothing : Just(f(this.value))
    }

    ap<U>(maybeF: Maybe<(value: T) => U>): Maybe<U> {
        return maybeF.isNothing() ? Nothing : this.map(maybeF.value)
    }

    alt(other: Maybe<T>): Maybe<T> {
        return this.isNothing() ? other : this
    }

    chain<U>(f: (value: T) => Maybe<U>): Maybe<U> {
        return this.isNothing() ? Nothing : f(this.value)
    }

    reduce<U>(reducer: (value: T) => U, initialValue: T): U {
        return reducer(this.isNothing() ? initialValue : this.value)
    }

    extend<U>(f: (value: Maybe<T>) => U): Maybe<U> {
        return this.isNothing() ? Nothing : Just(f(this))
    }

    unsafeCoerce(): T {
        return this.isNothing() ? (() => { throw new Error('Maybe got coerced to a null') })() : this.value
    }

    caseOf<U>(patterns: MaybePatterns<T, U>): U {
        return this.isNothing() ? patterns.Nothing() : patterns.Just(this.value)
    }

    orDefault(defaultValue: T): T {
        return this.isNothing() ? defaultValue : this.value
    }

    toList(): T[] {
        return this.isNothing() ?[] : [this.value]
    }

    mapOrDefault<U>(f: (value: T) => U, defaultValue: U): U {
        return this.map(f).orDefault(defaultValue)
    }

    extract(): T | null {
        return this.value
    }
}

export const Just = <T>(value: T): Maybe<T> =>
    new Maybe(value)

export const Nothing: Maybe<never> =
    new Maybe(null as never)