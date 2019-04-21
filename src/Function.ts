/** The identity function, returns the value it was given */
export const identity = <T>(x: T): T => x

/** Returns a function that always returns the same value. Also known as `const` in other languages */
export const always = <T>(x: T): (<U>(y: U) => T) => () => x

export const enum Order {
  LT = 'LT',
  EQ = 'EQ',
  GT = 'GT'
}

/** Compares two values using the default "<" and ">" operators */
export const compare = <T>(x: T, y: T): Order => {
  if (x > y) {
    return Order.GT
  } else if (x < y) {
    return Order.LT
  } else {
    return Order.EQ
  }
}

/** Maps the Order enum to the values expected by the standard ECMAScript library when doing comparison (Array.prototype.sort, for example) */
export const orderToNumber = (order: Order): number => {
  switch (order) {
    case Order.LT:
      return -1
    case Order.EQ:
      return 0
    case Order.GT:
      return 1
  }
}
