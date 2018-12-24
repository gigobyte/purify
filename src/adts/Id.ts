import { Show } from '../typeclasses/Show'
import { Functor } from '../typeclasses/Functor'
import { Chain } from '../typeclasses/Chain'
import { Apply } from '../typeclasses/Apply'
import { Monad } from '../typeclasses/Monad'
import { Applicative } from '../typeclasses/Applicative'
import { Setoid } from '../typeclasses/Setoid'

export interface Id<T> extends Id_<T> {}

export interface IId {
  <T>(value: T): Id<T>
  of: typeof Id_.of
}

export class Id_<T>
  implements
    Show,
    Functor<T>,
    Chain<T>,
    Apply<T>,
    Applicative<T>,
    Monad<T>,
    Setoid<Id<T>> {
  constructor(private readonly value: T) {}

  of = Id_.of
  readonly 'fantasy-land/map' = this.map
  readonly 'fantasy-land/chain' = this.chain
  readonly 'fantasy-land/ap' = this.ap
  readonly 'fantasy-land/of' = this.of
  readonly 'fantasy-land/equals' = this.equals

  static of<T>(value: T): Id<T> {
    return Id(value)
  }

  /** Returns the value stored in `this` */
  extract(): T {
    return this.value
  }

  toJSON(): T {
    return this.value
  }

  inspect(): string {
    return `Id(${this.value})`
  }

  toString(): string {
    return this.inspect()
  }

  /** Applies a function to the value stored in `this` */
  map<U>(f: (value: T) => U): Id<U> {
    return Id(f(this.value))
  }

  /** Transforms `this` with a function that returns an `Id` */
  chain<U>(f: (value: T) => Id<U>): Id<U> {
    return f(this.value)
  }

  /** Applies a function stored in Id to the value in `this` */
  ap<U>(f: Id<(value: T) => U>): Id<U> {
    return Id(f.value(this.value))
  }

  /** Compares the value in `this` with the value in the other `Id` */
  equals(other: Id<T>): boolean {
    return this.value === other.value
  }
}

const IdConstructor = <T>(value: T): Id<T> => new Id_(value)

export const Id: IId = Object.assign(IdConstructor, { of: Id_.of })
