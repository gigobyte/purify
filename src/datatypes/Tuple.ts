import Applicative from '../typeclasses/Applicative'
import Show from '../typeclasses/Show'
import Setoid from '../typeclasses/Setoid'
import Ord from '../typeclasses/Ord'
import Semigroup, { concat } from '../typeclasses/Semigroup'
import Bifunctor from '../typeclasses/Bifunctor'
import Functor from '../typeclasses/Functor'

export interface Tuple<F, S> extends Tuple_<F, S> {}

export class Tuple_<F, S> implements Show, Setoid<Tuple<F, S>>, Ord<Tuple<F, S>>, Semigroup<Tuple<F, S>>, Bifunctor<F, S>, Functor<S> {
    constructor(private readonly first: F, private readonly second: S) {}

    map = this.mapSecond
    readonly 'fantasy-land/equals' = this.equals
    readonly 'fantasy-land/lte' = this.lte
    readonly 'fantasy-land/concat' = this.concat
    readonly 'fantasy-land/bimap' = this.bimap
    readonly 'fantasy-land/map' = this.map

    static fanout<F, S, T>(f: (value: T) => F, g: (value: T) => S): (value: T) => Tuple<F, S>
    static fanout<F, S, T>(f: (value: T) => F, g: (value: T) => S, value: T): Tuple<F, S>
    static fanout<F, S, T>(f: (value: T) => F, g: (value: T) => S, value?: T) : any {
        if (value) {
            return Tuple(f(value), g(value))
        }

        return (value: T): Tuple<F, S> => Tuple(f(value), g(value))
    }

    toJSON(): [F, S] {
        return this.toArray()
    }

    inspect(): string {
        return this.toArray().toString()
    }

    toString(): string {
        return this.inspect()
    }

    fst(): F {
        return this.first
    }

    snd(): S {
        return this.second
    }

    equals(other: Tuple<F, S>): boolean {
        return this.first === other.first && this.second === other.second
    }

    lte(other: Tuple<F, S>): boolean {
        return this.first > other.first && this.second > other.second
    }

    bimap<F2, S2>(f: (fst: F) => F2, g: (snd: S) => S2): Tuple<F2, S2> {
        return Tuple(f(this.first), g(this.second))
    }

    mapFirst<F2>(f: (fst: F) => F2): Tuple<F2, S> {
        return Tuple(f(this.first), this.second)
    }

    mapSecond<S2>(f: (snd: S) => S2): Tuple<F, S2> {
        return Tuple(this.first, f(this.second))
    }

    toArray(): [F, S] {
        return [this.first, this.second]
    }

    fromArray<F, S>([fst, snd]: [F, S]): Tuple<F, S> {
        return Tuple(fst, snd)
    }

    swap(): Tuple<S, F> {
        return Tuple(this.second, this.first)
    }

    concat(other: Tuple<F, S>): Tuple<F, S> {
        return Tuple(concat(this.first, other.first), concat(this.second, other.second))
    }
}

export interface ITuple {
    <F, S>(fst: F, snd: S): Tuple<F, S>
    fanout: typeof Tuple_.fanout
}

const TupleConstructor = <F, S>(fst: F, snd: S): Tuple<F, S> =>
    new Tuple_(fst, snd)

export const Tuple: ITuple = Object.assign(TupleConstructor, {fanout: Tuple_.fanout})