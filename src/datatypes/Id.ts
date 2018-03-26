import Show from '../typeclasses/Show'
import Functor from '../typeclasses/Functor'
import Chain from '../typeclasses/Chain'
import Apply from '../typeclasses/Apply'
import Monad from '../typeclasses/Monad'
import Applicative from '../typeclasses/Applicative'
import Setoid from '../typeclasses/Setoid'
import Ord from '../typeclasses/Ord'
import Semigroup, { concat } from '../typeclasses/Semigroup'

export interface Id<T> extends Id_<T> { }

export class Id_<T> implements Show, Functor<T>, Chain<T>, Apply<T>, Applicative<T>, Monad<T>, Setoid<Id<T>>, Ord<Id<T>>, Semigroup<Id<T>> {
    constructor(private readonly value: T) {}

    of = Id_.of
    readonly 'fantasy-land/map' = this.map
    readonly 'fantasy-land/chain' = this.chain
    readonly 'fantasy-land/ap' = this.ap
    readonly 'fantasy-land/of' = this.of
    readonly 'fantasy-land/equals' = this.equals
    readonly 'fantasy-land/lte' = this.lte
    readonly 'fantasy-land/concat' = this.concat

    static of<T>(value: T): Id<T> {
        return Id(value)
    }

    unwrap(): T {
        return this.value
    }

    toJSON(): T {
        return this.value
    }

    inspect(): string {
        return this.value != null ? this.value.toString() : JSON.stringify(this.value)
    }

    toString(): string {
        return this.inspect()
    }

    map<U>(f: (value: T) => U): Id<U> {
        return Id(f(this.value))
    }

    chain<U>(f: (value: T) => Id<U>): Id<U> {
        return f(this.value)
    }

    ap<U>(f: Id<(value: T) => U>): Id<U> {
        return Id(f.value(this.value))
    }

    equals(other: Id<T>): boolean {
        return this.value === other.value
    }

    lte(other: Id<T>): boolean {
        return this.value <= other.value
    }

    concat(other: Id<T>): Id<T> {
        return Id(concat(this.value, other.value))
    }
}

export interface IId {
    <T>(value: T): Id<T>
    of: typeof Id_.of
}

const IdConstructor = <T>(value: T): Id<T> =>
    new Id_(value)

export const Id: IId = Object.assign(IdConstructor, {of: Id_.of})