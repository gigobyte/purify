import { Extends, BoolToString } from './Logic'

export type Inc<T extends number> = {0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 7: 8, 8: 9, 9: 10, [i: number]: number}[T]
export type Dec<T extends number> = {0: -1, 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 7: 6, 8: 7, 9: 8, 10: 9, [i: number]: number}[T]

export type Add<X extends number, Y extends number> =
    { true: X, false: Add<Inc<X>, Dec<Y>> }[BoolToString<Extends<Y, 0>>]

export type Subtract<X extends number, Y extends number> =
    { true: X, false: Subtract<Dec<X>, Dec<Y>> }[BoolToString<Extends<Y, 0>>]

export type Multiply<X extends number, Y extends number, TAcc extends number = 0> =
    { true: TAcc, false: Multiply<X, Dec<Y>, Add<TAcc, X>> }[BoolToString<Extends<Y, 0>>]

export type Range<TStart extends number, TEnd extends number> =
    { true: TStart, false: TStart | Range<Inc<TStart>, TEnd> }[BoolToString<Extends<TStart, TEnd>>]