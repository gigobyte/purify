import { Nothing, Just } from './Maybe'
import { Either, Left, Right } from './Either'

const anything = Math.random()

describe('Either', () => {
  test('fantasy-land', () => {
    expect(Left(Error()).constructor).toEqual(Either)
    expect(Right(5).constructor).toEqual(Either)
  })

  test('inspect', () => {
    expect(Left('Err').inspect()).toEqual('Left("Err")')
    expect(Right(1).inspect()).toEqual('Right(1)')
  })

  test('toString', () => {
    expect(Left('Err').toString()).toEqual('Left("Err")')
    expect(Right(1).toString()).toEqual('Right(1)')
  })

  test('toJSON', () => {
    expect(JSON.stringify(Left('Err'))).toEqual('"Err"')
    expect(JSON.stringify(Right(1)).toString()).toEqual('1')
  })

  test('of', () => {
    expect(Either.of(5)).toEqual(Right(5))
    expect(Either['fantasy-land/of'](5)).toEqual(Right(5))
  })

  test('lefts', () => {
    expect(Either.lefts([Left('Error'), Left('Error2'), Right(5)])).toEqual([
      'Error',
      'Error2'
    ])
  })

  test('rights', () => {
    expect(Either.rights([Right(10), Left('Error'), Right(5)])).toEqual([10, 5])
  })

  test('encase', () => {
    expect(
      Either.encase(() => {
        throw new Error('a')
      })
    ).toEqual(Left(new Error('a')))
    expect(Either.encase(() => 10)).toEqual(Right(10))
  })

  test('sequence', () => {
    expect(Either.sequence([])).toEqual(Right([]))
    expect(Either.sequence([Right(1), Right(2)])).toEqual(Right([1, 2]))
    expect(Either.sequence([Right(1), Left('Nope')])).toEqual(Left('Nope'))
  })

  test('isEither', () => {
    expect(Either.isEither(Left(''))).toEqual(true)
    expect(Either.isEither(Right(''))).toEqual(true)
    expect(Either.isEither(undefined)).toEqual(false)
    expect(Either.isEither('')).toEqual(false)
    expect(Either.isEither({})).toEqual(false)
  })

  test('isLeft', () => {
    expect(Left(anything).isLeft()).toEqual(true)
    expect(Right(anything).isLeft()).toEqual(false)
  })

  test('isRight', () => {
    expect(Left(anything).isRight()).toEqual(false)
    expect(Right(anything).isRight()).toEqual(true)
  })

  test('bimap', () => {
    expect(
      Left('Error').bimap(
        (x) => x + '!',
        (x) => x + 1
      )
    ).toEqual(Left('Error!'))
    expect(
      Right(5).bimap(
        (x) => x + '!',
        (x) => x + 1
      )
    ).toEqual(Right(6))

    expect(
      Left('Error')['fantasy-land/bimap'](
        (x) => x + '!',
        (x) => x + 1
      )
    ).toEqual(Left('Error!'))
    expect(
      Right(5)['fantasy-land/bimap'](
        (x) => x + '!',
        (x) => x + 1
      )
    ).toEqual(Right(6))
  })

  test('map', () => {
    expect(Left('Error').map((x) => x + 1)).toEqual(Left('Error'))
    expect(Right(5).map((x) => x + 1)).toEqual(Right(6))

    expect(Right(5)['fantasy-land/map']((x) => x + 1)).toEqual(Right(6))
  })

  test('mapLeft', () => {
    expect(Left('Error').mapLeft((x) => x + '!')).toEqual(Left('Error!'))
    expect(Right(5).mapLeft((x) => x + '!')).toEqual(Right(5))
  })

  test('ap', () => {
    expect(Right(5).ap(Right((x) => x + 1))).toEqual(Right(6))
    expect(Right(5).ap(Left('Error' as never))).toEqual(Left('Error'))
    expect(Left('Error').ap(Right((x) => x + 1))).toEqual(Left('Error'))
    expect(Left('Error').ap(Left('Function Error'))).toEqual(
      Left('Function Error')
    )

    expect(Right(5)['fantasy-land/ap'](Right((x) => x + 1))).toEqual(Right(6))
  })

  test('equals', () => {
    expect(Left('Error').equals(Left('Error'))).toEqual(true)
    expect(Left('Error').equals(Left('Error!'))).toEqual(false)
    expect(Left('Error').equals(Right('Error') as any)).toEqual(false)
    expect(Right(5).equals(Right(5))).toEqual(true)
    expect(Right(5).equals(Right(6))).toEqual(false)
    expect(Right(5).equals(Left('Error') as any)).toEqual(false)

    expect(Right(5)['fantasy-land/equals'](Right(5))).toEqual(true)
  })

  test('chain', () => {
    expect(Left('Error').chain((x) => Right(x + 1))).toEqual(Left('Error'))
    expect(Right(5).chain((x) => Right(x + 1))).toEqual(Right(6))

    expect(Right(5)['fantasy-land/chain']((x) => Right(x + 1))).toEqual(
      Right(6)
    )
  })

  test('chainLeft', () => {
    expect(Left('Error').chainLeft((x) => Left(x + '!'))).toEqual(
      Left('Error!')
    )
    expect(Right(5).chainLeft((x) => Right(x + 1))).toEqual(Right(5))
  })

  test('join', () => {
    expect(Right(Right(5)).join()).toEqual(Right(5))
    expect(Left(Left('')).join()).toEqual(Left(Left('')))
  })

  test('alt', () => {
    expect(Left('Error').alt(Left('Error!'))).toEqual(Left('Error!'))
    expect(Left('Error').alt(Right(5) as any)).toEqual(Right(5))
    expect(Right(5).alt(Left('Error') as any)).toEqual(Right(5))
    expect(Right(5).alt(Right(6))).toEqual(Right(5))

    expect(Right(5)['fantasy-land/alt'](Right(6))).toEqual(Right(5))
  })

  test('altLazy', () => {
    const fn = jest.fn(() => Left('Error!'))
    const fn2 = jest.fn(() => Right(5))
    expect(Left('Error').altLazy(fn)).toEqual(Left('Error!'))
    expect(Right(5).altLazy(fn2)).toEqual(Right(5))

    expect(fn).toBeCalledTimes(1)
    expect(fn2).not.toHaveBeenCalled()
  })

  test('reduce', () => {
    expect(Right(5).reduce((acc, x) => x * acc, 2)).toEqual(10)
    expect(Left('Error').reduce((acc, x) => x * acc, 0)).toEqual(0)

    expect(Right(5)['fantasy-land/reduce']((acc, x) => x * acc, 2)).toEqual(10)
  })

  test('extend', () => {
    expect(Left('Error').extend((x) => x.isRight())).toEqual(Left('Error'))
    expect(Right(5).extend((x) => x.isRight())).toEqual(Right(true))

    expect(Right(5)['fantasy-land/extend']((x) => x.isRight())).toEqual(
      Right(true)
    )
  })

  test('unsafeCoerce', () => {
    expect(Right(5).unsafeCoerce()).toEqual(5)
    expect(() => Left('Error').unsafeCoerce()).toThrow()
    expect(() => Left(new Error('a')).unsafeCoerce()).toThrowError(
      new Error('a')
    )
  })

  test('caseOf', () => {
    expect(
      Left('Error').caseOf({ Left: (x) => x, Right: () => 'No error' })
    ).toEqual('Error')
    expect(Right(6).caseOf({ Left: (_) => 0, Right: (x) => x + 1 })).toEqual(7)
    expect(Right(6).caseOf({ _: () => 0 })).toEqual(0)
    expect(Left('Error').caseOf({ _: () => 0 })).toEqual(0)
  })

  test('leftOrDefault', () => {
    expect(Left('Error').leftOrDefault('No error')).toEqual('Error')
    expect(Right(5).leftOrDefault('No error' as never)).toEqual('No error')
  })

  test('orDefault', () => {
    expect(Left('Error').orDefault(0 as never)).toEqual(0)
    expect(Right(5).orDefault(0)).toEqual(5)
  })

  test('leftOrDefaultLazy', () => {
    expect(Left('Error').leftOrDefaultLazy(() => 'No error')).toEqual('Error')
    expect(Right(5).leftOrDefaultLazy(() => 'No error' as never)).toEqual(
      'No error'
    )
  })

  test('orDefaultLazy', () => {
    expect(Left('Error').orDefaultLazy(() => 0 as never)).toEqual(0)
    expect(Right(5).orDefaultLazy(() => 0)).toEqual(5)
  })

  test('ifLeft', () => {
    let a = 0
    Left('Error').ifLeft(() => {
      a = 5
    })
    expect(a).toEqual(5)

    let b = 0
    Right(5).ifLeft(() => {
      b = 5
    })
    expect(b).toEqual(0)
  })

  test('ifRight', () => {
    let a = 0
    Left('Error').ifRight(() => {
      a = 5
    })
    expect(a).toEqual(0)

    let b = 0
    Right(5).ifRight(() => {
      b = 5
    })
    expect(b).toEqual(5)
  })

  test('toMaybe', () => {
    expect(Left('Error').toMaybe()).toEqual(Nothing)
    expect(Right(5).toMaybe()).toEqual(Just(5))
  })

  test('leftToMaybe', () => {
    expect(Left('Error').leftToMaybe()).toEqual(Just('Error'))
    expect(Right(5).leftToMaybe()).toEqual(Nothing)
  })

  test('extract', () => {
    expect(Right(5).extract()).toEqual(5)
    expect(Left('Error').extract()).toEqual('Error')
  })

  test('swap', () => {
    expect(Right(5).swap()).toEqual(Left(5))
    expect(Left(5).swap()).toEqual(Right(5))
  })
})
