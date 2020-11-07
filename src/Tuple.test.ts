import { Tuple } from './Tuple'
describe('Tuple', () => {
  it('should be ArrayLike', () => {
    const [fst, snd] = Tuple(1, 'test')

    expect(fst).toEqual(1)
    expect(snd).toEqual('test')
  })

  test('inspect', () => {
    expect(Tuple(1, 'a').inspect()).toEqual('Tuple(1, "a")')
  })

  test('toString', () => {
    expect(Tuple(1, 'a').toString()).toEqual('Tuple(1, "a")')
  })

  test('toJSON', () => {
    expect(JSON.stringify(Tuple(1, 'a'))).toEqual('[1,"a"]')
  })

  test('fanout', () => {
    expect(
      Tuple.fanout(
        (x) => x[0],
        (x) => x.length,
        'sss'
      )
    ).toEqual(Tuple('s', 3))
    expect(
      Tuple.fanout(
        (x: string) => x[0],
        (x) => x.length
      )('sss')
    ).toEqual(Tuple('s', 3))
    expect(Tuple.fanout((x: string) => x[0])((x) => x.length)('sss')).toEqual(
      Tuple('s', 3)
    )
  })

  test('fromArray', () => {
    expect(Tuple.fromArray([5, 10])).toEqual(Tuple(5, 10))
  })

  test('fst', () => {
    expect(Tuple(5, 10).fst()).toEqual(5)
  })

  test('snd', () => {
    expect(Tuple(5, 10).snd()).toEqual(10)
  })

  test('equals', () => {
    expect(Tuple(5, 10).equals(Tuple(5, 10))).toEqual(true)
    expect(Tuple(5, 5).equals(Tuple(5, 10))).toEqual(false)
    expect(Tuple(10, 5).equals(Tuple(10, 10))).toEqual(false)
    expect(Tuple(0, 5).equals(Tuple(10, 15))).toEqual(false)

    expect(Tuple(5, 5)['fantasy-land/equals'](Tuple(5, 10))).toEqual(false)
  })

  test('bimap', () => {
    expect(
      Tuple(5, 'Error').bimap(
        (x) => x + 1,
        (x) => x + '!'
      )
    ).toEqual(Tuple(6, 'Error!'))

    expect(
      Tuple(5, 'Error')['fantasy-land/bimap'](
        (x) => x + 1,
        (x) => x + '!'
      )
    ).toEqual(Tuple(6, 'Error!'))
  })

  test('mapFirst', () => {
    expect(Tuple(5, 5).mapFirst((x) => x + 1)).toEqual(Tuple(6, 5))
  })

  test('map', () => {
    expect(Tuple(5, 5).map((x) => x + 1)).toEqual(Tuple(5, 6))

    expect(Tuple(5, 5)['fantasy-land/map']((x) => x + 1)).toEqual(Tuple(5, 6))
  })

  test('reduce', () => {
    expect(Tuple(1, 1).reduce((acc, x) => acc + x, 0)).toEqual(1)

    expect(Tuple(1, 1)['fantasy-land/reduce']((acc, x) => acc + x, 0)).toEqual(
      1
    )
  })

  test('toArray', () => {
    expect(Tuple(5, 5).toArray()).toEqual([5, 5])
  })

  test('swap', () => {
    expect(Tuple(5, 10).swap()).toEqual(Tuple(10, 5))
  })

  test('ap', () => {
    expect(Tuple(5, 10).ap(Tuple(0, (x) => x + 1))).toEqual(Tuple(5, 11))

    expect(Tuple(5, 10)['fantasy-land/ap'](Tuple(0, (x) => x + 1))).toEqual(
      Tuple(5, 11)
    )
  })

  test('every', () => {
    expect(Tuple(5, 10).every((x) => x > 0)).toEqual(true)
    expect(Tuple(-5, 10).every((x) => x > 0)).toEqual(false)
  })

  test('some', () => {
    expect(Tuple(5, 10).some((x) => x === 10)).toEqual(true)
    expect(Tuple(-5, 10).some((x) => x > 0)).toEqual(true)
    expect(Tuple('abc', 'bcd').some((x) => x.includes('x'))).toEqual(false)
  })
})
