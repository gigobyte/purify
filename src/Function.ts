/** The identity function, returns the value it was given */
export const identity = <T>(x: T): T => x

/** Returns a function that always returns the same value. Also known as `const` in other languages */
export const always = <T>(x: T): (<U>(y: U) => T) => () => x
