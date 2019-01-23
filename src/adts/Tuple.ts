import { Show } from '../typeclasses/Show'

export interface TupleTypeRef {
  <F, S>(fst: F, snd: S): Tuple<F, S>
  fanout<F, S, T>(f: (value: T) => F, g: (value: T) => S, value: T): Tuple<F, S>
  fanout<F, S, T>(
    f: (value: T) => F,
    g: (value: T) => S
  ): (value: T) => Tuple<F, S>
  fanout<F, T>(
    f: (value: T) => F
  ): <S>(g: (value: T) => S) => (value: T) => Tuple<F, S>
  fromArray<F, S>([fst, snd]: [F, S]): Tuple<F, S>
}

export interface Tuple<F, S> extends Show, Iterable<F | S>, ArrayLike<F | S> {
  0: F
  1: S
  [index: number]: F | S
  length: 2
  toJSON(): [F, S]
  inspect(): string
  toString(): string
  fst(): F
  snd(): S
  equals(other: Tuple<F, S>): boolean
  bimap<F2, S2>(f: (fst: F) => F2, g: (snd: S) => S2): Tuple<F2, S2>
  mapFirst<F2>(f: (fst: F) => F2): Tuple<F2, S>
  map<S2>(f: (snd: S) => S2): Tuple<F, S2>
  reduce<T>(reducer: (accumulator: T, value: S) => T, initialValue: T): T
  toArray(): [F, S]
  swap(): Tuple<S, F>
  ap<T, S2>(f: Tuple<T, (value: S) => S2>): Tuple<F, S2>
}

const TupleConstructor = <F, S>(fst: F, snd: S): Tuple<F, S> => ({
  0: fst,
  1: snd,
  length: 2,
  *[Symbol.iterator]() {
    yield fst
    yield snd
  },
  toJSON(): [F, S] {
    return this.toArray()
  },
  inspect(): string {
    return `Tuple(${fst}, ${snd})`
  },
  toString(): string {
    return this.inspect()
  },
  fst(): F {
    return fst
  },
  snd(): S {
    return snd
  },
  equals(other: Tuple<F, S>): boolean {
    return fst === other.fst() && snd === other.snd()
  },
  bimap<F2, S2>(f: (fst: F) => F2, g: (snd: S) => S2): Tuple<F2, S2> {
    return Tuple(f(fst), g(snd))
  },
  mapFirst<F2>(f: (fst: F) => F2): Tuple<F2, S> {
    return Tuple(f(fst), snd)
  },
  map<S2>(f: (snd: S) => S2): Tuple<F, S2> {
    return Tuple(fst, f(snd))
  },
  reduce<T>(reducer: (accumulator: T, value: S) => T, initialValue: T): T {
    return reducer(initialValue, snd)
  },
  toArray(): [F, S] {
    return [fst, snd]
  },
  swap(): Tuple<S, F> {
    return Tuple(snd, fst)
  },
  ap<T, S2>(f: Tuple<T, (value: S) => S2>): Tuple<F, S2> {
    return Tuple(fst, f.snd()(snd))
  }
})

export const Tuple: TupleTypeRef = Object.assign(TupleConstructor, {
  fromArray: <F, S>([fst, snd]: [F, S]): Tuple<F, S> => {
    return Tuple(fst, snd)
  },
  fanout: <F, S, T>(
    ...args: [(value: T) => F, ((value: T) => S)?, T?]
  ): any => {
    const [f, g, value] = args

    switch (args.length) {
      case 3:
        return Tuple(f(value!), g!(value!))
      case 2:
        return (value: T) => Tuple.fanout(f, g!, value)
      default:
        return <S>(g: (value: T) => S) => (value: T) =>
          Tuple.fanout(f, g, value)
    }
  }
})
