/** The identity function, returns the value it was given */
export const identity = <T>(x: T): T => x

/** Returns a function that always returns the same value. Also known as `const` in other languages */
export const always =
  <T>(x: T): (<U>(y: U) => T) =>
  () =>
    x

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

type TupleOfLength<T extends any[]> = Extract<{ [K in keyof T]: any }, any[]>

export type CurriedFn<TAllArgs extends any[], TReturn> = <
  TProvidedArgs extends TAllArgs extends [infer TFirstArg, ...infer TRestOfArgs]
    ? [TFirstArg, ...Partial<TRestOfArgs>]
    : never
>(
  ...args: TProvidedArgs
) => TProvidedArgs extends TAllArgs
  ? TReturn
  : TAllArgs extends [...TupleOfLength<TProvidedArgs>, ...infer TRestOfArgs]
  ? CurriedFn<TRestOfArgs, TReturn>
  : never

/** Takes a function that receives multiple arguments and returns a "curried" version of that function that can take any number of those arguments and if they are less than needed a new function that takes the rest of them will be returned */
export const curry = <TArgs extends any[], TReturn>(
  fn: (...args: TArgs) => TReturn
): CurriedFn<TArgs, TReturn> =>
  function currify(...args: any[]): any {
    return args.length >= fn.length
      ? fn.apply(undefined, args as TArgs)
      : currify.bind(undefined, ...args)
  }
