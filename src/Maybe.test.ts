import './customMatchers'
import { Maybe, Just, Nothing } from './Maybe'
import { Left, Right } from './Either'

describe('Maybe', () => {
  test('of', () => {
    expect(Maybe.of(5)).toEqualStringified(Just(5))
    expect(Maybe['fantasy-land/of'](5)).toEqualStringified(Just(5))
  })

  test('fromNullable', () => {
    expect(Maybe.fromNullable(null)).toEqualStringified(Nothing)
    expect(Maybe.fromNullable(5)).toEqualStringified(Just(5))
  })

  test('fromFalsy', () => {
    expect(Maybe.fromFalsy(0)).toEqualStringified(Nothing)
    expect(Maybe.fromFalsy('')).toEqualStringified(Nothing)
    expect(Maybe.fromFalsy(5)).toEqualStringified(Just(5))
  })

  test('fromPredicate', () => {
    expect(Maybe.fromPredicate(x => x > 0, 0)).toEqualStringified(Nothing)
    expect(Maybe.fromPredicate(x => x === 0, 0)).toEqualStringified(Just(0))
    expect(Maybe.fromPredicate<number>(x => x > 0)(0)).toEqualStringified(
      Nothing
    )
  })

  test('empty', () => {
    expect(Maybe.empty()).toEqualStringified(Nothing)
    expect(Maybe['fantasy-land/empty']()).toEqualStringified(Nothing)
  })

  test('zero', () => {
    expect(Maybe.zero()).toEqualStringified(Nothing)
    expect(Maybe['fantasy-land/zero']()).toEqualStringified(Nothing)
  })

  test('catMaybes', () => {
    expect(Maybe.catMaybes([Just(5), Nothing, Just(10)])).toEqualStringified([
      5,
      10
    ])
    expect(Maybe.catMaybes([Nothing])).toEqualStringified([])
  })

  test('mapMaybe', () => {
    expect(
      Maybe.mapMaybe(x => (x > 5 ? Just(x) : Nothing))([1, 2, 3, 7, 8, 9])
    ).toEqualStringified([7, 8, 9])
    expect(
      Maybe.mapMaybe(x => (x > 5 ? Just(x) : Nothing), [1, 2, 3, 7, 8, 9])
    ).toEqualStringified([7, 8, 9])
  })

  test('encase', () => {
    expect(
      Maybe.encase(() => {
        throw new Error('a')
      })
    ).toEqualStringified(Nothing)
    expect(Maybe.encase(() => 10)).toEqualStringified(Just(10))
  })

  test('isJust', () => {
    expect(Just(5).isJust()).toEqualStringified(true)
    expect(Nothing.isJust()).toEqualStringified(false)
  })

  test('isNothing', () => {
    expect(Just(5).isNothing()).toEqualStringified(false)
    expect(Nothing.isNothing()).toEqualStringified(true)
    expect(Just(null).isNothing()).toEqualStringified(false)
  })

  test('equals', () => {
    expect(Just(5).equals(Just(5))).toEqualStringified(true)
    expect(Just(5).equals(Just(10))).toEqualStringified(false)
    expect(Just(5).equals(Nothing)).toEqualStringified(false)
    expect(Nothing.equals(Just(5 as never))).toEqualStringified(false)
    expect(Nothing.equals(Nothing)).toEqualStringified(true)

    expect(Just(5)['fantasy-land/equals'](Just(5))).toEqualStringified(true)
  })

  test('map', () => {
    expect(Just(5).map(x => x + 1)).toEqualStringified(Just(6))
    expect(Nothing.map(x => x + 1)).toEqualStringified(Nothing)

    expect(Just(5)['fantasy-land/map'](x => x + 1)).toEqualStringified(Just(6))
  })

  test('ap', () => {
    expect(Just(5).ap(Just((x: number) => x + 1))).toEqualStringified(Just(6))
    expect(Just(5).ap(Nothing)).toEqualStringified(Nothing)
    expect(Nothing.ap(Just((x: number) => x + 1))).toEqualStringified(Nothing)
    expect(Nothing.ap(Nothing)).toEqualStringified(Nothing)

    expect(Just(5)['fantasy-land/ap'](Nothing)).toEqualStringified(Nothing)
  })

  test('alt', () => {
    expect(Just(5).alt(Just(6))).toEqualStringified(Just(5))
    expect(Just(5).alt(Nothing)).toEqualStringified(Just(5))
    expect(Nothing.alt(Just(5 as never))).toEqualStringified(Just(5))
    expect(Nothing.alt(Nothing)).toEqualStringified(Nothing)

    expect(Just(5)['fantasy-land/alt'](Nothing)).toEqualStringified(Just(5))
  })

  test('chain', () => {
    expect(Just(5).chain(x => Just(x + 1))).toEqualStringified(Just(6))
    expect(Nothing.chain(x => Just(x + 1))).toEqualStringified(Nothing)

    expect(Just(5)['fantasy-land/chain'](x => Just(x + 1))).toEqualStringified(
      Just(6)
    )
  })

  test('chainNullable', () => {
    expect(Just(5).chainNullable(x => x + 1)).toEqualStringified(Just(6))
    expect(Nothing.chainNullable(x => x + 1)).toEqualStringified(Nothing)
    expect(Just({ prop: null }).chainNullable(x => x.prop)).toEqualStringified(
      Nothing
    )
  })

  test('join', () => {
    expect(Just(Just(5)).join()).toEqualStringified(Just(5))
    expect(Nothing.join()).toEqualStringified(Nothing)
  })

  test('reduce', () => {
    expect(Just(5).reduce((acc, x) => x * acc, 2)).toEqualStringified(10)
    expect(Nothing.reduce((acc, x) => x * acc, 0)).toEqualStringified(0)

    expect(
      Just(5)['fantasy-land/reduce']((acc, x) => x * acc, 2)
    ).toEqualStringified(10)
  })

  test('extend', () => {
    expect(Just(5).extend(x => x.isJust())).toEqualStringified(Just(true))
    expect(Nothing.extend(x => x.isJust())).toEqualStringified(Nothing)

    expect(Just(5)['fantasy-land/extend'](x => x.isJust())).toEqualStringified(
      Just(true)
    )
  })

  test('unsafeCoerce', () => {
    expect(Just(5).unsafeCoerce()).toEqualStringified(5)
    expect(() => Nothing.unsafeCoerce()).toThrow()
  })

  test('caseOf', () => {
    expect(
      Just(5).caseOf({ Just: x => x + 1, Nothing: () => 0 })
    ).toEqualStringified(6)
    expect(
      Nothing.caseOf({ Just: x => x + 1, Nothing: () => 0 })
    ).toEqualStringified(0)
    expect(Just(10).caseOf({ _: () => 99 })).toEqualStringified(99)
    expect(Nothing.caseOf({ _: () => 99 })).toEqualStringified(99)
  })

  test('orDefault', () => {
    expect(Just(5).orDefault(0)).toEqualStringified(5)
    expect(Nothing.orDefault(0 as never)).toEqualStringified(0)
  })

  test('orDefaultLazy', () => {
    expect(Just(5).orDefaultLazy(() => 0)).toEqualStringified(5)
    expect(Nothing.orDefaultLazy(() => 0 as never)).toEqualStringified(0)
  })

  test('toList', () => {
    expect(Just(5).toList()).toEqualStringified([5])
    expect(Nothing.toList()).toEqualStringified([])
  })

  test('mapOrDefault', () => {
    expect(Just(5).mapOrDefault(x => x + 1, 0)).toEqualStringified(6)
    expect(Nothing.mapOrDefault(x => x + 1, 0)).toEqualStringified(0)
  })

  test('extract', () => {
    expect(Just(5).extract()).toEqualStringified(5)
    expect(Nothing.extract()).toEqualStringified(undefined)
  })

  test('extractNullable', () => {
    expect(Just(5).extractNullable()).toEqualStringified(5)
    expect(Nothing.extractNullable()).toEqualStringified(null)
  })

  test('toEither', () => {
    expect(Just(5).toEither('Error')).toEqualStringified(Right(5))
    expect(Nothing.toEither('Error')).toEqualStringified(Left('Error'))
  })

  test('ifJust', () => {
    let a = 0
    Just(5).ifJust(() => {
      a = 5
    })
    expect(a).toEqualStringified(5)

    let b = 0
    Nothing.ifJust(() => {
      b = 5
    })
    expect(b).toEqualStringified(0)
  })

  test('ifNothing', () => {
    let a = 0
    Just(5).ifNothing(() => {
      a = 5
    })
    expect(a).toEqualStringified(0)

    let b = 0
    Nothing.ifNothing(() => {
      b = 5
    })
    expect(b).toEqualStringified(5)
  })

  test('filter', () => {
    expect(Just(5).filter(x => x > 10)).toEqualStringified(Nothing)
    expect(Just(5).filter(x => x > 0)).toEqualStringified(Just(5))
    expect(Nothing.filter(x => x > 0)).toEqualStringified(Nothing)
  })
})
