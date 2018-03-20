export type If<T extends boolean, U, I> =
    T extends true ? U : I

export type And<T extends boolean, U extends boolean> =
    T extends true
        ? U extends true
            ? true
            : false
        : false

export type Not<T extends boolean> =
    T extends true ? false : true

export type Or<T extends boolean, U extends boolean> =
    T extends true
        ? true
        : U extends true
            ? true
            : false

export type Extends<T, U> =
    T extends U ? true : false

export type BoolToString<T extends boolean> =
    T extends true ? 'true' : 'false'