export interface NonEmptyList<T> extends NonEmptyList_<T> {}
export type ArrayWithMultipleElements<T extends Array<any> & {0: T[number]}> = Array<any> & {0: T[number]}

export class NonEmptyList_<T> extends Array<T> {
    constructor(xs: T) {
        super(xs)
    }

    concat(...xs: (T | ConcatArray<T>)[]): NonEmptyList<T> {
        return super.concat(...xs)
    }

    //TODO: add all Array prototype methods
}

export const NonEmptyList = <T extends ArrayWithMultipleElements<T>>(xs: T): NonEmptyList<T[number]> =>
    new NonEmptyList_(xs)