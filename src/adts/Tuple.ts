import { Show } from '../typeclasses/Show'
import { Setoid } from '../typeclasses/Setoid'
import { Bifunctor } from '../typeclasses/Bifunctor'
import { Functor } from '../typeclasses/Functor'
import { Apply } from '../typeclasses/Apply'

export interface Tuple<F, S> extends Tuple_<F, S> {}

export interface ITuple {
    <F, S>(fst: F, snd: S): Tuple<F, S>
    fanout: typeof Tuple_.fanout,
    fromArray: typeof Tuple_.fromArray
}

export class Tuple_<F, S> implements Show, Setoid<Tuple<F, S>>, Bifunctor<F, S>, Functor<S>, Apply<S>, Iterable<F | S>, ArrayLike<F | S> {
    0: F
    1: S
    [index: number]: F | S
    length: 2 = 2

    constructor(private readonly first: F, private readonly second: S) {}

    readonly 'fantasy-land/equals' = this.equals
    readonly 'fantasy-land/bimap' = this.bimap
    readonly 'fantasy-land/map' = this.map
    readonly 'fantasy-land/ap' = this.ap

    /** Applies two functions over a single value and constructs a tuple from the results */
    static fanout<F, S, T>(f: (value: T) => F, g: (value: T) => S): (value: T) => Tuple<F, S>
    static fanout<F, S, T>(f: (value: T) => F, g: (value: T) => S, value: T): Tuple<F, S>
    static fanout<F, T>(f: (value: T) => F): <S>(g: (value: T) => S) => (value: T) => Tuple<F, S>
    static fanout<F, S, T>(f: (value: T) => F, g?: (value: T) => S, value?: T) : any {
        switch (arguments.length) {
            case 3:
                return Tuple(f(value!), g!(value!))
            case 2:
                return (value: T) => Tuple.fanout(f, g!, value)
            default:
                return <S>(g: (value: T) => S) => (value: T) => Tuple.fanout(f, g, value)
        }
    }

    /** Constructs a tuple from an array with two elements */
    static fromArray<F, S>([fst, snd]: [F, S]): Tuple<F, S> {
        return Tuple(fst, snd)
    }

    *[Symbol.iterator]() {
        yield this.first
        yield this.second
    }

    toJSON(): [F, S] {
        return this.toArray()
    }

    inspect(): string {
        return `Tuple(${this.first}, ${this.second})`
    }

    toString(): string {
        return this.inspect()
    }

    /** Returns the first value of `this` */
    fst(): F {
        return this.first
    }

    /** Returns the second value of `this` */
    snd(): S {
        return this.second
    }

    /** Compares the values inside `this` and another tuple */
    equals(other: Tuple<F, S>): boolean {
        return this.first === other.first && this.second === other.second
    }

    /** Transforms the two values inside `this` with two mapper functions */
    bimap<F2, S2>(f: (fst: F) => F2, g: (snd: S) => S2): Tuple<F2, S2> {
        return Tuple(f(this.first), g(this.second))
    }

    /** Applies a function to the first value of `this` */
    mapFirst<F2>(f: (fst: F) => F2): Tuple<F2, S> {
        return Tuple(f(this.first), this.second)
    }

    /** Applies a function to the second value of `this` */
    map<S2>(f: (snd: S) => S2): Tuple<F, S2> {
        return Tuple(this.first, f(this.second))
    }

    /** Returns an array with 2 elements - the values inside `this` */
    toArray(): [F, S] {
        return [this.first, this.second]
    }

    /** Swaps the values inside `this` */
    swap(): Tuple<S, F> {
        return Tuple(this.second, this.first)
    }

    /** Applies the second value of a tuple to the second value of `this` */
    ap<T, S2>(f: Tuple<T, (value: S) => S2>): Tuple<F, S2> {
        return Tuple(this.first, f.second(this.second))
    }
}

const TupleConstructor = <F, S>(fst: F, snd: S): Tuple<F, S> =>
    new Tuple_(fst, snd)

export const Tuple: ITuple = Object.assign(TupleConstructor, {fanout: Tuple_.fanout, fromArray: Tuple_.fromArray})