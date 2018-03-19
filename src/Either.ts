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

const _left: unique symbol = Symbol('Left')
const _right: unique symbol = Symbol('Right')

export type Left<L> = Either<L, never>
export type Right<R> = Either<never, R>

export class Either<L, R> implements Show, Setoid<L | R>, Ord<L | R>, Semigroup<L | R>, Functor<R>, Apply<R>, Applicative<R>, Alt<L | R>, Chain<R>, Monad<R>, Foldable<L | R>, Extend<L | R>, Unsafe {
    constructor(private value: L | R, private tag: symbol) {}

    of = Either.of
    'fantasy-land/alt' = this.alt
    'fantasy-land/of' = this.of
    'fantasy-land/ap' = this.ap
    'fantasy-land/chain' = this.chain
    'fantasy-land/reduce' = this.reduce
    'fantasy-land/map' = this.map
    'fantasy-land/lte' = this.lte
    'fantasy-land/extend' = this.extend
    'fantasy-land/concat' = this.concat
    'fantasy-land/equals' = this.equals

    private asLeft(): Left<L> {
        return this as any as Left<L>
    }

    private asRight(): Right<R> {
        return this as any as Right<R>
    }

    static of<R>(value: R ): Either<never, R> {
        return Right(value)
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

    ap<T>(other: Either<L, (value: R) => T>): Either<L, T> {
        return other.isLeft() ? other.asLeft() : this.map(other.asRight().value)
    }

    equals(other: Either<L, R>): other is this {
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
}

export const Left = <T>(value: T): Left<T> =>
    new Either(value, _left)

export const Right = <T>(value: T): Right<T> =>
    new Either(value, _right)