export interface NonEmptyList<T> extends NonEmptyList_<T> {}
export type ArrayWithMultipleElements<T extends Array<any> & {0: T[number]}> = Array<any> & {0: T[number]}

export class NonEmptyList_<T> extends Array<T> {
    constructor(xs: T) {
        super(xs)
    }

    concat(...items: ConcatArray<T>[]): NonEmptyList<T>
    concat(...xs: (T | ConcatArray<T>)[]): NonEmptyList<T> {
        return super.concat(...xs)
    }

    reverse(): NonEmptyList<T> {
        return super.reverse()
    }

    slice(start?: number, end?: number): NonEmptyList<T> {
        return super.slice(start, end)
    }

    splice(start: number, deleteCount: number, ...items: T[]): NonEmptyList<T>
    splice(start: number, deleteCount?: number): NonEmptyList<T> {
        return super.splice(start, deleteCount)
    }

    map<U>(callbackfn: (value: T, index: number, array: NonEmptyList<T>) => U, thisArg?: any): NonEmptyList<U> {
        return super.map(callbackfn, thisArg)
    }

    filter<S extends T>(callbackfn: (value: T, index: number, array: NonEmptyList<T>) => value is S, thisArg?: any): NonEmptyList<S>
    filter(callbackfn: (value: T, index: number, array: NonEmptyList<T>) => any, thisArg?: any): NonEmptyList<T> {
        return super.filter(callbackfn, thisArg)
    }
}

export const NonEmptyList = <T extends ArrayWithMultipleElements<T>>(xs: T): NonEmptyList<T[number]> =>
    new NonEmptyList_(xs)