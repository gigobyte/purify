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

export type StateFn<S, R> = (state: S) => Tuple<R, S>

export interface State<S, R> extends State_<S, R> { }

export interface IState {
    <S, R>(f: (state: S) => Tuple<R, S>): State<S, R>
    of: typeof State_.of
    get: typeof State_.get
    put: typeof State_.put
    modify: typeof State_.modify
}

class State_<S, R> implements Functor<R>, Apply<R>, Applicative<R>, Chain<R>, Monad<R>, Show {
    constructor(private readonly run: StateFn<S, R>) {}

    readonly of = State_.of
    readonly 'fantasy-land/of' = this.of
    readonly 'fantasy-land/map' = this.map
    readonly 'fantasy-land/ap' = this.ap
    readonly 'fantasy-land/chain' = this.chain

    static of<S = unknown, R = unknown>(result: R): State<S, R> {
        return State(state => Tuple(result, state))
    }

    static get<S>(): State<S, S> {
        return State(state => Tuple(state, state))
    }

    static put<S>(state: S): State<S, unknown> {
        return State(() => Tuple(undefined, state))
    }

    static modify<S>(f: (state: S) => S): State<S, unknown> {
        return State(state => Tuple(undefined, f(state)))
    }

    inspect(): string {
        return `State(${this.run})`
    }

    toString(): string {
        return this.inspect()
    }

    toJSON(): StateFn<S, R> {
        return this.run
    }

    runWith(state: S): Tuple<R, S> {
        return this.run(state)
    }

    evalWith(state: S): R {
        return this.run(state).fst()
    }

    execWith(state: S): S {
        return this.run(state).snd()
    }

    map<B>(f: (result: R) => B): State<S, B> {
        return State((state: S) => this.runWith(state).mapFirst(f))
    }

    ap<B>(fstate: State<S, (result: R) => B>): State<S, B> {
        return fstate.chain(f => this.map(f))
    }

    chain<B>(f: (result: R) => State<S, B>): State<S, B> {
        return State(state => {
            const [ newResult, newState ] = this.run(state)
            return f(newResult).runWith(newState)
        })
    }
}

const StateConstructor = <S = unknown, R = unknown>(f: StateFn<S, R>): State<S, R> =>
    new State_(f)

export const State: IState = Object.assign(StateConstructor, {get: State_.get, put: State_.put, modify: State_.modify, of: State_.of})