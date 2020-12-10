import { curry } from './Function'

describe('Function', () => {
  test('curry', () => {
    const sum3 = (x: number, y: number, z: number) => x + y + z
    const curriedSum3 = curry(sum3)

    expect(curriedSum3(1)(2)(3)).toEqual(6)
    expect(curriedSum3(1, 2)(3)).toEqual(6)
    expect(curriedSum3(1, 2, 3)).toEqual(6)
    expect(curriedSum3(1)(2, 3)).toEqual(6)

    // @ts-expect-error
    curriedSum3()
    // @ts-expect-error
    curriedSum3(5)()
    // @ts-expect-error
    curriedSum3(5)(3)()
  })
})
