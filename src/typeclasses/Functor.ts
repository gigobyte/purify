import { HigherKindedType } from './../utils/HigherKindedType'
import { Maybe } from '../adts/Maybe'
import { Either } from '../adts/Either'
import { Tuple } from '../adts/Tuple'
import { Id } from '../adts/Id'

export interface Functor<T> extends HigherKindedType {
    map<U>(f: (value: T) => U): Functor<U>
    'fantasy-land/map'?: Functor<T>['map']
}

export interface FunctorInstances<HKT, Kinds extends ArrayLike<any> = any, FunctorialKind = any> {
    [index: string]: {
        kinds: any[]
        functorialKind: any
        construct: any
    }

    Maybe: {
        kinds: HKT extends Maybe<infer U> ? [U] : any[]
        functorialKind: HKT extends Maybe<infer U> ? U : any[]
        construct: Maybe<FunctorialKind>
    }

    Either: {
        kinds: HKT extends Either<infer T, infer U> ? [T, U] : any[],
        functorialKind: HKT extends Either<infer T, infer U> ? U : any[],
        construct: Either<Kinds[0], FunctorialKind>
    }

    Tuple: {
        kinds: HKT extends Tuple<infer T, infer U> ? [T, U]: any[],
        functorialKind: HKT extends Tuple<infer T, infer U> ? U: any[],
        construct: Tuple<Kinds[0], FunctorialKind>
    }

    Id: {
        kinds: HKT extends Id<infer T> ? [T] : any[]
        functorialKind: HKT extends Id<infer T> ? T : any[]
        construct: Id<FunctorialKind>
    }
}

type GetFunctorialKind<T extends Functor<any>> =
    FunctorInstances<T>[T['__tag']]['functorialKind']

type SetFunctorialKind<T extends Functor<any>, Kind> =
    FunctorInstances<T, FunctorInstances<T>[T['__tag']]['kinds'], Kind>[T['__tag']]['construct']

export const map = <T extends Functor<any>, U>(f: (value: GetFunctorialKind<T>) => U, functor: T): SetFunctorialKind<T, U> =>
    functor.map(f)