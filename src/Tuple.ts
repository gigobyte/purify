export interface TupleTypeRef {
  <F, S>(fst: F, snd: S): Tuple<F, S>
  /** Applies two functions over a single value and constructs a tuple from the results */
  fanout<F, S, T>(f: (value: T) => F, g: (value: T) => S, value: T): Tuple<F, S>
  fanout<F, S, T>(
    f: (value: T) => F,
    g: (value: T) => S
  ): (value: T) => Tuple<F, S>
  fanout<F, T>(
    f: (value: T) => F
  ): <S>(g: (value: T) => S) => (value: T) => Tuple<F, S>
  /** Constructs a tuple from an array with two elements */
  fromArray<F, S>([fst, snd]: [F, S]): Tuple<F, S>
}

export interface Tuple<F, S> extends Iterable<F | S>, ArrayLike<F | S> {
  0: F
  1: S
  [index: number]: F | S
  length: 2
  toJSON(): [F, S]
  inspect(): string
  toString(): string
  /** Returns the first value of `this` */
  fst(): F
  /** Returns the second value of `this` */
  snd(): S
  /** Compares the values inside `this` and another tuple */
  equals(other: Tuple<F, S>): boolean
  /** Transforms the two values inside `this` with two mapper functions */
  bimap<F2, S2>(f: (fst: F) => F2, g: (snd: S) => S2): Tuple<F2, S2>
  /** Applies a function to the first value of `this` */
  mapFirst<F2>(f: (fst: F) => F2): Tuple<F2, S>
  /** Applies a function to the second value of `this` */
  map<S2>(f: (snd: S) => S2): Tuple<F, S2>
  /** A somewhat arbitrary implementation of Foldable for Tuple, the reducer will be passed the initial value and the second value inside `this` as arguments */
  reduce<T>(reducer: (accumulator: T, value: S) => T, initialValue: T): T
  /** Returns an array with 2 elements - the values inside `this` */
  toArray(): [F, S]
  /** Swaps the values inside `this` */
  swap(): Tuple<S, F>
  /** Applies the second value of a tuple to the second value of `this` */
  ap<T, S2>(f: Tuple<T, (value: S) => S2>): Tuple<F, S2>
  /** Tests whether both elements in the tuple pass the test implemented by the provided function */
  every(pred: (value: F | S) => boolean): boolean
  /** Tests whether at least one element in the tuple passes the test implemented by the provided function */
  some(pred: (value: F | S) => boolean): boolean

  'fantasy-land/equals'(other: Tuple<F, S>): boolean
  'fantasy-land/bimap'<F2, S2>(
    f: (fst: F) => F2,
    g: (snd: S) => S2
  ): Tuple<F2, S2>
  'fantasy-land/map'<S2>(f: (snd: S) => S2): Tuple<F, S2>
  'fantasy-land/reduce'<T>(
    reducer: (accumulator: T, value: S) => T,
    initialValue: T
  ): T
  'fantasy-land/ap'<T, S2>(f: Tuple<T, (value: S) => S2>): Tuple<F, S2>
}

class TupleImpl<F, S> implements Tuple<F, S> {
  0: F
  1: S;
  [index: number]: F | S
  length: 2 = 2

  constructor(private first: F, private second: S) {
    this[0] = first
    this[1] = second
  }

  *[Symbol.iterator]() {
    yield this.first
    yield this.second
  }

  toJSON(): [F, S] {
    return this.toArray()
  }

  inspect(): string {
    return `Tuple(${JSON.stringify(this.first)}, ${JSON.stringify(
      this.second
    )})`
  }

  toString(): string {
    return this.inspect()
  }

  fst(): F {
    return this.first
  }

  snd(): S {
    return this.second
  }

  equals(other: Tuple<F, S>): boolean {
    return this.first === other.fst() && this.second === other.snd()
  }

  bimap<F2, S2>(f: (fst: F) => F2, g: (snd: S) => S2): Tuple<F2, S2> {
    return Tuple(f(this.first), g(this.second))
  }

  mapFirst<F2>(f: (fst: F) => F2): Tuple<F2, S> {
    return Tuple(f(this.first), this.second)
  }

  map<S2>(f: (snd: S) => S2): Tuple<F, S2> {
    return Tuple(this.first, f(this.second))
  }

  reduce<T>(reducer: (accumulator: T, value: S) => T, initialValue: T): T {
    return reducer(initialValue, this.second)
  }

  toArray(): [F, S] {
    return [this.first, this.second]
  }

  swap(): Tuple<S, F> {
    return Tuple(this.second, this.first)
  }

  ap<T, S2>(f: Tuple<T, (value: S) => S2>): Tuple<F, S2> {
    return Tuple(this.first, f.snd()(this.second))
  }

  every(pred: (value: F | S) => boolean): boolean {
    return pred(this.first) && pred(this.second)
  }

  some(pred: (value: F | S) => boolean): boolean {
    return pred(this.first) || pred(this.second)
  }

  'fantasy-land/equals' = this.equals
  'fantasy-land/bimap' = this.bimap
  'fantasy-land/map' = this.map
  'fantasy-land/reduce' = this.reduce
  'fantasy-land/ap' = this.ap
}

export const Tuple: TupleTypeRef = Object.assign(
  <F, S>(fst: F, snd: S) => new TupleImpl(fst, snd),
  {
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
          return <S>(g: (value: T) => S) =>
            (value: T) =>
              Tuple.fanout(f, g, value)
      }
    }
  }
)

TupleImpl.prototype.constructor = Tuple as any
