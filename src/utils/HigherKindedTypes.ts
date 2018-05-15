import { Maybe } from '../adts/Maybe'
import { Either } from '../adts/Either'
import { Tuple } from '../adts/Tuple';
import { Id } from '../adts/Id';

export interface HigherKindedType {
    __tag: string
}

export interface HigherKindedTypes<HKT, Kinds extends ArrayLike<any>> {
    [index: string]: {
        infer: any[]
        construct: any
    }

    Maybe: {
        infer: HKT extends Maybe<infer U> ? [U] : any[]
        construct: Maybe<Kinds[0]>
    }

    Either: {
        infer: HKT extends Either<infer T, infer U> ? [T, U] : any[],
        construct: Either<Kinds[0], Kinds[1]>
    }

    Tuple: {
        infer: HKT extends Tuple<infer T, infer U> ? [T, U] : any[],
        construct: Tuple<Kinds[0], Kinds[1]>
    }

    Id: {
        infer: HKT extends Id<infer T> ? [T] : any[]
        construct: Id<Kinds[0]>
    }
}

export type ExtractKinds<T extends HigherKindedType> = HigherKindedTypes<T, [any]>[T['__tag']]['infer']
export type SetKinds<T extends HigherKindedType, U extends ArrayLike<any>> = HigherKindedTypes<T, U>[T['__tag']]['construct']