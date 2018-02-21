export type Tuple<F, S> = [F, S] & {kind: 'Tuple'}

export const Tuple = <F, S>(fst: F, snd: S): Tuple<F, S> =>
    [fst, snd] as Tuple<F, S>

export const fst = <F, S>([fst, _]: Tuple<F, S>): F =>
    fst

export const snd = <F, S>([_, snd]: Tuple<F, S>): S =>
    snd

export const bimap = <F, S, T, U>(fstMapper: (fst: F) => T , sndMapper: (snd: S) => U, [fst, snd]: Tuple<F, S>): Tuple<T, U> =>
    Tuple(fstMapper(fst), sndMapper(snd))

export const mapFirst = <F, S, T>(mapper: (fst: F) => T, [fst, snd]: Tuple<F, S>): Tuple<T, S> =>
    Tuple(mapper(fst), snd)

export const mapSecond = <F, S, T>(mapper: (snd: S) => T, [fst, snd]: Tuple<F, S>): Tuple<F, T> =>
    Tuple(fst, mapper(snd))

export const lift = <F, S, T, U>(fstMapper: (fst: F) => T, sndMapper: (snd: S) => U) => (tuple: Tuple<F, S>): Tuple<T, U> =>
    bimap(fstMapper, sndMapper, tuple)

export const liftFirst = <F, T>(mapper: (fst: F) => T) => <S>(tuple: Tuple<F, S>): Tuple<T, S> =>
    mapFirst(mapper, tuple)

export const liftSecond = <S, T>(mapper: (snd: S) => T) => <F>(tuple: Tuple<F, S>): Tuple<F, T> =>
    mapSecond(mapper, tuple)

export const equals = <F, S>([fst1, snd1]: Tuple<F, S>, [fst2, snd2]: Tuple<F, S>): boolean =>
    fst1 === fst2 && snd1 === snd2

export const toArray = <F, S>(tuple: Tuple<F, S>): [F, S] =>
    tuple as [F, S]

export const fromArray = <F, S>([fst, snd]: [F, S]): Tuple<F, S> =>
    Tuple(fst, snd)

export const swap = <F, S>([fst, snd]: Tuple<F, S>): Tuple<S, F> =>
    Tuple(snd, fst)