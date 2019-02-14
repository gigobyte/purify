export const identity = <T>(x: T): T => x

export const always = <T>(x: T): (<U>(y: U) => T) => () => x
