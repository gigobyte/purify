export type NonEmptyList<T>
    = [T]
    | [T, T]
    | [T, T, T]
    | [T, T, T, T]
    | [T, T, T, T, T]
    | [T, T, T, T, T, T]
    | [T, T, T, T, T, T, T]
    | [T, T, T, T, T, T, T, T]
    | [T, T, T, T, T, T, T, T, T]
    | [T, T, T, T, T, T, T, T, T, T]

// type Fst<T extends { 0: any }> = T['0']

// export const NonEmptyList = <T extends {0: Fst<T>}>(arr: T): NonEmptyList<Fst<T>> =>
//     arr as NonEmptyList<Fst<T>>

// export const isNonEmpty = <T>(arr: T[]): arr is NonEmptyList<T> =>
//     arr.length > 0


type ArrayWithElement<T extends Array<any> & {0: T['0']}> = Array<any> & {0: T['0']}

export const NonEmptyList = <T extends ArrayWithElement<T>>(arr: T): NonEmptyList<T['0']> =>
    arr as NonEmptyList<T['0']>