export type Tuple<F, S> = [F, S] & {kind: 'Tuple'}

export const Tuple = <F, S>(fst: F, snd: S): Tuple<F, S> =>
    [fst, snd] as Tuple<F, S>

/** Returns the first element of a `Tuple` */
export const fst = <F, S>([fst, _]: Tuple<F, S>): F =>
    fst

/** Returns the second element of a `Tuple` */
export const snd = <F, S>([_, snd]: Tuple<F, S>): S =>
    snd

/** Transforms the two values inside a `Tuple` with two mapper functions */
export const bimap = <F, S, T, U>(fstMapper: (fst: F) => T , sndMapper: (snd: S) => U, [fst, snd]: Tuple<F, S>): Tuple<T, U> =>
    Tuple(fstMapper(fst), sndMapper(snd))

/** Applies a function on the first value of a `Tuple` */
export const mapFirst = <F, S, T>(mapper: (fst: F) => T, [fst, snd]: Tuple<F, S>): Tuple<T, S> =>
    Tuple(mapper(fst), snd)

/** Applies a function on the second value of a `Tuple` */
export const mapSecond = <F, S, T>(mapper: (snd: S) => T, [fst, snd]: Tuple<F, S>): Tuple<F, T> =>
    Tuple(fst, mapper(snd))

/** Curried version of `Tuple.bimap` */
export const lift = <F, S, T, U>(fstMapper: (fst: F) => T, sndMapper: (snd: S) => U) => (tuple: Tuple<F, S>): Tuple<T, U> =>
    bimap(fstMapper, sndMapper, tuple)

/** Curried version of `Tuple.mapFirst` */
export const liftFirst = <F, T>(mapper: (fst: F) => T) => <S>(tuple: Tuple<F, S>): Tuple<T, S> =>
    mapFirst(mapper, tuple)

/** Curried version of `Tuple.mapSecond` */
export const liftSecond = <S, T>(mapper: (snd: S) => T) => <F>(tuple: Tuple<F, S>): Tuple<F, T> =>
    mapSecond(mapper, tuple)

/** Compares the values inside two `Tuple`s using `===` */
export const equals = <F, S>([fst1, snd1]: Tuple<F, S>, [fst2, snd2]: Tuple<F, S>): boolean =>
    fst1 === fst2 && snd1 === snd2

/** Typecasts a `Tuple` into an `Array` */
export const toArray = <F, S>(tuple: Tuple<F, S>): [F, S] =>
    tuple as [F, S]

/** Typecasts an `Array` into a `Tuple` */
export const fromArray = <F, S>([fst, snd]: [F, S]): Tuple<F, S> =>
    Tuple(fst, snd)

/** Swaps the values inside a `Tuple` */ 
export const swap = <F, S>([fst, snd]: Tuple<F, S>): Tuple<S, F> =>
    Tuple(snd, fst)

/** Given two functions, apply both to a value and construct a `Tuple` from the results */
export const fanout = <F, S, T>(firstMapper: (value: T) => F, secondMapper: (value: T) => S) => (value: T): Tuple<F, S> =>
    Tuple(firstMapper(value), secondMapper(value))