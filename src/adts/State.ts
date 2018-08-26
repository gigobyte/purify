/**
 * WARNING
 * This module is undocumented. Use with caution
 */

import { Tuple } from './Tuple'
import { Functor } from '../typeclasses/Functor'
import { Show } from '../typeclasses/Show'
import { Apply } from '../typeclasses/Apply'
import { Applicative } from '../typeclasses/Applicative'
import { Chain } from '../typeclasses/Chain'
import { Monad } from '../typeclasses/Monad'

export type StateFn<S, A> = (state: S) => Tuple<A, S>

export interface State<S, A> extends State_<S, A> { }

export interface IState {
    <S, A>(f: (state: S) => Tuple<A, S>): State<S, A>
    get: typeof State_.get
    put: typeof State_.put
    modify: typeof State_.modify
}

class State_<S, A> implements Functor<A>, Apply<A>, Applicative<A>, Chain<A>, Monad<A>, Show {
    constructor(private readonly runner: StateFn<S, A>) {}

    readonly of = State_.of
    readonly 'fantasy-land/of' = this.of
    readonly 'fantasy-land/map' = this.map
    readonly 'fantasy-land/ap' = this.ap
    readonly 'fantasy-land/chain' = this.chain

    static of<S, A>(value: A): State<S, A> {
        return State(s => Tuple(value, s))
    }

    static get<S>(): State<S, S> {
        return State(s => Tuple(s, s))
    }

    static put<S>(state: S): State<S, unknown> {
        return State(() => Tuple(undefined, state))
    }

    static modify<S>(f: (state: S) => S): State<S, unknown> {
        return State(s => Tuple(undefined, f(s)))
    }

    inspect(): string {
        return `State(${this.runner})`
    }

    toString(): string {
        return this.inspect()
    }

    toJSON(): StateFn<S, A> {
        return this.runner
    }

    runWith(state: S): Tuple<A, S> {
        return this.runner(state)
    }

    evalWith(state: S): A {
        return this.runner(state).fst()
    }

    execWith(state: S): S {
        return this.runner(state).snd()
    }

    map<B>(f: (value: A) => B): State<S, B> {
        return State((s: S) => this.runWith(s).mapFirst(f))
    }

    ap<B>(fstate: State<S, (value: A) => B>): State<S, B> {
        return fstate.chain(f => this.map(f))
    }

    chain<B>(f: (value: A) => State<S, B>): State<S, B> {
        return State(s => {
            const [a, s1] = this.runner(s)
            return f(a).runWith(s1)
        })
    }
}

const StateConstructor = <S, A>(f: StateFn<S, A>): State<S, A> =>
    new State_(f)

export const State: IState = Object.assign(StateConstructor, {get: State_.get, put: State_.put, modify: State_.modify})