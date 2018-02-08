export type Tuple<T, U> = [T, U] & {kind: 'Tuple'}

export const Tuple = <T, U>(fst: T, snd: U): Tuple<T, U> =>
    [fst, snd] as Tuple<T, U>