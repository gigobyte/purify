export type Nothing = void | null | undefined
export type Just<T> = T
export type Maybe<T> = Just<T> | Nothing

export const Just = <T>(value: T): Maybe<T> =>
    value

export const Nothing =
    null

