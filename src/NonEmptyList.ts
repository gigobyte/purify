
type NonEmptyList<T>
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
    | T & {kind: 'NonEmptyList'} & T[]

type Fst<T extends { 0: any }> = T['0']

export const NonEmptyList = <T extends {0: Fst<T>}>(arr: T): NonEmptyList<Fst<T>> =>
    arr as NonEmptyList<Fst<T>>

export const isNonEmpty = <T>(arr: T[]): arr is NonEmptyList<T> =>
    arr.length > 0