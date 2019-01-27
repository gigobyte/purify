import './customMatchers'
import { Nothing, Just } from './Maybe'
import { Either, Left, Right } from './Either'

const anything = Math.random()

describe('Either', () => {
  test('of', () => {
    expect(Either.of(5)).toEqualStringified(Right(5))
    expect(Either['fantasy-land/of'](5)).toEqualStringified(Right(5))
  })

  test('lefts', () => {
    expect(
      Either.lefts([Left('Error'), Left('Error2'), Right(5)])
    ).toEqualStringified(['Error', 'Error2'])
  })

  test('rights', () => {
    expect(
      Either.rights([Right(10), Left('Error'), Right(5)])
    ).toEqualStringified([10, 5])
  })

  test('encase', () => {
    expect(
      Either.encase(() => {
        throw new Error('a')
      })
    ).toEqualStringified(Left(new Error('a')))
    expect(Either.encase(() => 10)).toEqualStringified(Right(10))
  })

  test('isLeft', () => {
    expect(Left(anything).isLeft()).toEqualStringified(true)
    expect(Right(anything).isLeft()).toEqualStringified(false)
  })

  test('isRight', () => {
    expect(Left(anything).isRight()).toEqualStringified(false)
    expect(Right(anything).isRight()).toEqualStringified(true)
  })

  test('bimap', () => {
    expect(Left('Error').bimap(x => x + '!', x => x + 1)).toEqualStringified(
      Left('Error!')
    )
    expect(Right(5).bimap(x => x + '!', x => x + 1)).toEqualStringified(
      Right(6)
    )

    expect(
      Right(5)['fantasy-land/bimap'](x => x + '!', x => x + 1)
    ).toEqualStringified(Right(6))
  })

  test('map', () => {
    expect(Left('Error').map(x => x + 1)).toEqualStringified(Left('Error'))
    expect(Right(5).map(x => x + 1)).toEqualStringified(Right(6))

    expect(Right(5)['fantasy-land/map'](x => x + 1)).toEqualStringified(
      Right(6)
    )
  })

  test('mapLeft', () => {
    expect(Left('Error').mapLeft(x => x + '!')).toEqualStringified(
      Left('Error!')
    )
    expect(Right(5).mapLeft(x => x + '!')).toEqualStringified(Right(5))
  })

  test('ap', () => {
    expect(Right(5).ap(Right((x: number) => x + 1))).toEqualStringified(
      Right(6)
    )
    expect(Right(5).ap(Left('Error' as never))).toEqualStringified(
      Left('Error')
    )
    expect(Left('Error').ap(Right((x: number) => x + 1))).toEqualStringified(
      Left('Error')
    )
    expect(Left('Error').ap(Left('Function Error'))).toEqualStringified(
      Left('Function Error')
    )

    expect(
      Right(5)['fantasy-land/ap'](Right((x: number) => x + 1))
    ).toEqualStringified(Right(6))
  })

  test('equals', () => {
    expect(Left('Error').equals(Left('Error'))).toEqualStringified(true)
    expect(Left('Error').equals(Left('Error!'))).toEqualStringified(false)
    expect(Left('Error').equals(Right('Error') as any)).toEqualStringified(
      false
    )
    expect(Right(5).equals(Right(5))).toEqualStringified(true)
    expect(Right(5).equals(Right(6))).toEqualStringified(false)
    expect(Right(5).equals(Left('Error') as any)).toEqualStringified(false)

    expect(Right(5)['fantasy-land/equals'](Right(5))).toEqualStringified(true)
  })

  test('chain', () => {
    expect(Left('Error').chain(x => Right(x + 1))).toEqualStringified(
      Left('Error')
    )
    expect(Right(5).chain(x => Right(x + 1))).toEqualStringified(Right(6))

    expect(
      Right(5)['fantasy-land/chain'](x => Right(x + 1))
    ).toEqualStringified(Right(6))
  })

  test('join', () => {
    expect(Right(Right(5)).join()).toEqualStringified(Right(5))
    expect(Left(Left('')).join()).toEqualStringified(Left(Left('')))
  })

  test('alt', () => {
    expect(Left('Error').alt(Left('Error!'))).toEqualStringified(Left('Error!'))
    expect(Left('Error').alt(Right(5) as any)).toEqualStringified(Right(5))
    expect(Right(5).alt(Left('Error') as any)).toEqualStringified(Right(5))
    expect(Right(5).alt(Right(6))).toEqualStringified(Right(5))

    expect(Right(5)['fantasy-land/alt'](Right(6))).toEqualStringified(Right(5))
  })

  test('reduce', () => {
    expect(Right(5).reduce((acc, x) => x * acc, 2)).toEqualStringified(10)
    expect(Left('Error').reduce((acc, x) => x * acc, 0)).toEqualStringified(0)

    expect(
      Right(5)['fantasy-land/reduce']((acc, x) => x * acc, 2)
    ).toEqualStringified(10)
  })

  test('extend', () => {
    expect(Left('Error').extend(x => x.isRight())).toEqualStringified(
      Left('Error')
    )
    expect(Right(5).extend(x => x.isRight())).toEqualStringified(Right(true))

    expect(
      Right(5)['fantasy-land/extend'](x => x.isRight())
    ).toEqualStringified(Right(true))
  })

  test('unsafeCoerce', () => {
    expect(Right(5).unsafeCoerce()).toEqualStringified(5)
    expect(() => Left('Error').unsafeCoerce()).toThrow()
  })

  test('caseOf', () => {
    expect(
      Left('Error').caseOf({ Left: x => x, Right: () => 'No error' })
    ).toEqualStringified('Error')
    expect(
      Right(6).caseOf({ Left: _ => 0, Right: x => x + 1 })
    ).toEqualStringified(7)
    expect(Right(6).caseOf({ _: () => 0 })).toEqualStringified(0)
    expect(Left('Error').caseOf({ _: () => 0 })).toEqualStringified(0)
  })

  test('leftOrDefault', () => {
    expect(Left('Error').leftOrDefault('No error')).toEqualStringified('Error')
    expect(Right(5).leftOrDefault('No error' as never)).toEqualStringified(
      'No error'
    )
  })

  test('orDefault', () => {
    expect(Left('Error').orDefault(0 as never)).toEqualStringified(0)
    expect(Right(5).orDefault(0)).toEqualStringified(5)
  })

  test('leftOrDefaultLazy', () => {
    expect(
      Left('Error').leftOrDefaultLazy(() => 'No error')
    ).toEqualStringified('Error')
    expect(
      Right(5).leftOrDefaultLazy(() => 'No error' as never)
    ).toEqualStringified('No error')
  })

  test('orDefaultLazy', () => {
    expect(Left('Error').orDefaultLazy(() => 0 as never)).toEqualStringified(0)
    expect(Right(5).orDefaultLazy(() => 0)).toEqualStringified(5)
  })

  test('ifLeft', () => {
    let a = 0
    Left('Error').ifLeft(() => {
      a = 5
    })
    expect(a).toEqualStringified(5)

    let b = 0
    Right(5).ifLeft(() => {
      b = 5
    })
    expect(b).toEqualStringified(0)
  })

  test('ifRight', () => {
    let a = 0
    Left('Error').ifRight(() => {
      a = 5
    })
    expect(a).toEqualStringified(0)

    let b = 0
    Right(5).ifRight(() => {
      b = 5
    })
    expect(b).toEqualStringified(5)
  })

  test('toMaybe', () => {
    expect(Left('Error').toMaybe()).toEqualStringified(Nothing)
    expect(Right(5).toMaybe()).toEqualStringified(Just(5))
  })

  test('leftToMaybe', () => {
    expect(Left('Error').leftToMaybe()).toEqualStringified(Just('Error'))
    expect(Right(5).leftToMaybe()).toEqualStringified(Nothing)
  })

  test('either', () => {
    expect(Right(5).either(_ => 0, x => x + 1)).toEqualStringified(6)
    expect(Left('Error').either(x => x + '!', _ => '')).toEqualStringified(
      'Error!'
    )
  })

  test('extract', () => {
    expect(Right(5).extract()).toEqualStringified(5)
    expect(Left('Error').extract()).toEqualStringified('Error')
  })
})
