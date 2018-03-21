import Show from '../typeclasses/Show'
import Setoid from '../typeclasses/Setoid'
import Ord from '../typeclasses/Ord'
import Semigroup, { concat } from '../typeclasses/Semigroup'
import Monoid from '../typeclasses/Monoid'
import Functor from '../typeclasses/Functor'
import Apply from '../typeclasses/Apply'
import Applicative from '../typeclasses/Applicative'
import Plus from '../typeclasses/Plus'
import Alt from '../typeclasses/Alt'
import Alternative from '../typeclasses/Alternative'
import Chain from '../typeclasses/Chain'
import Monad from '../typeclasses/Monad'
import Foldable from '../typeclasses/Foldable'
import Extend from '../typeclasses/Extend'
import Bifunctor from '../typeclasses/Bifunctor'
import Unsafe from '../typeclasses/Unsafe'

import { Maybe, Just, Nothing } from './Maybe'

const _left: unique symbol = Symbol('Left')
const _right: unique symbol = Symbol('Right')

export type Left<L> = Either<L, never>
export type Right<R> = Either<never, R>
export type EitherPatterns<L, R, T> = { Left: (l: L) => T, Right: (r: R) => T }

export class Either<L, R> implements Show, Setoid<Either<L, R>>, Ord<Either<L, R>>, Semigroup<Either<L, R>>, Functor<R>, Apply<R>, Applicative<R>, Alt<L | R>, Chain<R>, Monad<R>, Foldable<L | R>, Extend<L | R>, Bifunctor<L, R>, Unsafe {
    constructor(private readonly value: L | R, private readonly tag: symbol) {}

    readonly of = Either.of
    readonly 'fantasy-land/alt' = this.alt
    readonly 'fantasy-land/of' = this.of
    readonly 'fantasy-land/ap' = this.ap
    readonly 'fantasy-land/chain' = this.chain
    readonly 'fantasy-land/reduce' = this.reduce
    readonly 'fantasy-land/map' = this.map
    readonly 'fantasy-land/lte' = this.lte
    readonly 'fantasy-land/extend' = this.extend
    readonly 'fantasy-land/concat' = this.concat
    readonly 'fantasy-land/equals' = this.equals
    readonly 'fantasy-land/bimap' = this.bimap

    private asLeft(): Left<L> {
        return this as any as Left<L>
    }

    private asRight(): Right<R> {
        return this as any as Right<R>
    }

    static of<R>(value: R ): Either<never, R> {
        return Right(value)
    }

    static lefts<L, R>(list: Either<L,R>[]): L[] {
        return list.filter(x => x.isLeft()).map(x => x.asLeft().value)
    }

    static rights<L, R>(list: Either<L, R>[]): R[] {
        return list.filter(x => x.isRight()).map(x => x.asRight().value)
    }

    static encase<L extends Error, R>(throwsF: () => R): Either<L, R> {
        try {
            return Right(throwsF())
        } catch(e) {
            return Left(e)
        }
    }

    isLeft(): boolean {
        return this.tag === _left
    }

    isRight(): boolean {
        return this.tag === _right
    }

    toJSON(): L | R {
        return this.value
    }

    inspect(): string {
        return this.value ? this.value.toString() : JSON.stringify(this.value)
    }

    toString(): string {
        return this.inspect()
    }

    bimap<L2, R2>(f: (value: L) => L2, g: (value: R) => R2): Either<L2, R2> {
        return this.isLeft() ? Left(f(this.asLeft().value)) : Right(g(this.asRight().value))
    }

    map<T>(f: (value: R) => T): Either<L, T> {
        return this.bimap(x => x, f)
    }

    mapLeft<T>(f: (value: L) => T): Either<T, R> {
        return this.bimap(f, x => x)
    }

    ap<T>(other: Either<L, (value: R) => T>): Either<L, T> {
        return other.isLeft() ? other.asLeft() : this.map(other.asRight().value)
    }

    equals(other: Either<L, R>): boolean {
        if (this.isLeft() && other.isLeft()) {
            return this.value === other.value
        }

        if (this.isRight() && other.isRight()) {
            return this.value === other.value
        }

        return false
    }

    lte(other: Either<L, R>): boolean {
        if (this.isLeft() && other.isRight()) {
            return true
        }

        if (this.isLeft() && other.isLeft()) {
            return this.value <= other.value
        }

        if (this.isRight() && other.isRight()) {
            return this.value <= other.value
        }

        return false
    }

    concat(other: Either<L, R>): Either<L, R> {
        if (this.isLeft() && other.isLeft()) {
            return Left(concat(this.asLeft().value, other.asLeft().value))
        }

        if (this.isRight() && other.isRight()) {
            return Right(concat(this.asRight().value, other.asRight().value))
        }

        if (this.isLeft() && other.isRight()) {
            return other
        }

        return this
    }

    chain<R2>(f: (value: R) => Either<L, R2>): Either<L, R2> {
        return this.isLeft() ? this.asLeft() : f(this.asRight().value)
    }

    alt(other: Either<L, R>): Either<L, R> {
        return this.isRight() ? this : other
    }

    reduce<T>(f: (value: R) => T, defaultValue: R): T {
        return f(this.isRight() ? this.asRight().value : defaultValue)
    }

    extend<T>(f: (value: Either<L, R>) => T): Either<L, T> {
        return this.isLeft() ? this.asLeft() : Right(f(this))
    }

    unsafeCoerce(): R {
        return this.isLeft() ? (() => { throw new Error('Either got coerced to a Left') })() : this.asRight().value;
    }

    caseOf<T>(patterns: EitherPatterns<L, R, T>): T {
        return this.isLeft() ? patterns.Left(this.asLeft().value) : patterns.Right(this.asRight().value)
    }

    leftOrDefault(defaultValue: L): L {
        return this.isLeft() ? this.asLeft().value : defaultValue
    }

    rightOrDefault(defaultValue: R): R {
        return this.isRight() ? this.asRight().value : defaultValue
    }
    
    whenLeft(effect: (value: L) => any): this {
        return this.isLeft() ? (effect(this.asLeft().value), this) : this
    }

    whenRight(effect: (value: R) => any): this {
        return this.isLeft() ? this : (effect(this.asRight().value), this)
    }

    toMaybe(): Maybe<R> {
        return this.isLeft() ? Nothing : Just(this.asRight().value)
    }

    leftToMaybe(): Maybe<L> {
        return this.isLeft() ? Just(this.asLeft().value) : Nothing
    }

    either<T>(ifLeft: (value: L) => T, ifRight: (value: R) => T): T {
        return this.isLeft() ? ifLeft(this.asLeft().value) : ifRight(this.asRight().value)
    }

    extract(): L | R {
        return this.value
    }
}

export const Left = <T>(value: T): Left<T> =>
    new Either(value, _left)

export const Right = <T>(value: T): Right<T> =>
    new Either(value, _right)