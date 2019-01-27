import './customMatchers'
import { Tuple } from './Tuple'

describe('Tuple', () => {
  it('should be ArrayLike', () => {
    const [fst, snd] = Tuple(1, 'test')
    expect(fst).toEqual(1)
    expect(snd).toEqual('test')
  })

  test('fanout', () => {
    expect(
      Tuple.fanout((x: string) => x[0], x => x.length, 'sss')
    ).toEqualStringified(Tuple('s', 3))
    expect(
      Tuple.fanout((x: string) => x[0], x => x.length)('sss')
    ).toEqualStringified(Tuple('s', 3))
    expect(
      Tuple.fanout((x: string) => x[0])(x => x.length)('sss')
    ).toEqualStringified(Tuple('s', 3))
  })

  test('fromArray', () => {
    expect(Tuple.fromArray([5, 10])).toEqualStringified(Tuple(5, 10))
  })

  test('fst', () => {
    expect(Tuple(5, 10).fst()).toEqualStringified(5)
  })

  test('snd', () => {
    expect(Tuple(5, 10).snd()).toEqualStringified(10)
  })

  test('equals', () => {
    expect(Tuple(5, 10).equals(Tuple(5, 10))).toEqualStringified(true)
    expect(Tuple(5, 5).equals(Tuple(5, 10))).toEqualStringified(false)
    expect(Tuple(10, 5).equals(Tuple(10, 10))).toEqualStringified(false)
    expect(Tuple(0, 5).equals(Tuple(10, 15))).toEqualStringified(false)

    expect(Tuple(5, 5)['fantasy-land/equals'](Tuple(5, 10))).toEqualStringified(
      false
    )
  })

  test('bimap', () => {
    expect(
      Tuple(5, 'Error').bimap(x => x + 1, x => x + '!')
    ).toEqualStringified(Tuple(6, 'Error!'))

    expect(
      Tuple(5, 'Error')['fantasy-land/bimap'](x => x + 1, x => x + '!')
    ).toEqualStringified(Tuple(6, 'Error!'))
  })

  test('mapFirst', () => {
    expect(Tuple(5, 5).mapFirst(x => x + 1)).toEqualStringified(Tuple(6, 5))
  })

  test('map', () => {
    expect(Tuple(5, 5).map(x => x + 1)).toEqualStringified(Tuple(5, 6))

    expect(Tuple(5, 5)['fantasy-land/map'](x => x + 1)).toEqualStringified(
      Tuple(5, 6)
    )
  })

  test('reduce', () => {
    expect(Tuple(1, 1).reduce((acc, x) => acc + x, 0)).toEqualStringified(1)

    expect(
      Tuple(1, 1)['fantasy-land/reduce']((acc, x) => acc + x, 0)
    ).toEqualStringified(1)
  })

  test('toArray', () => {
    expect(Tuple(5, 5).toArray()).toEqualStringified([5, 5])
  })

  test('swap', () => {
    expect(Tuple(5, 10).swap()).toEqualStringified(Tuple(10, 5))
  })

  test('ap', () => {
    expect(Tuple(5, 10).ap(Tuple(0, (x: number) => x + 1))).toEqualStringified(
      Tuple(5, 11)
    )

    expect(
      Tuple(5, 10)['fantasy-land/ap'](Tuple(0, (x: number) => x + 1))
    ).toEqualStringified(Tuple(5, 11))
  })
})
