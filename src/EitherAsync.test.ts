import { EitherAsync } from './EitherAsync'
import { Left, Right, Either } from './Either'
import { Nothing, Just } from './Maybe'

describe('EitherAsync', () => {
  test('fantasy-land', () => {
    expect(EitherAsync(async () => {}).constructor).toEqual(EitherAsync)
  })

  test('liftEither', () => {
    EitherAsync(async ({ liftEither }) => {
      const value: 5 = await liftEither(Right<5>(5))
    })
  })

  test('fromPromise', () => {
    EitherAsync(async ({ fromPromise }) => {
      const value: 5 = await fromPromise(Promise.resolve(Right<5>(5)))
    })
  })

  test('throwE', async () => {
    const ea = EitherAsync<string, number>(async ({ liftEither, throwE }) => {
      const value: 5 = await liftEither(Right<5>(5))
      throwE('Test')
      return value
    })

    expect(await ea.run()).toEqual(Left('Test'))
  })

  test('try/catch', async () => {
    const ea = EitherAsync<string, void>(async ({ fromPromise, throwE }) => {
      try {
        await fromPromise(Promise.reject('shouldnt show'))
      } catch {
        throwE('should show')
      }
    })

    expect(await ea.run()).toEqual(Left('should show'))
  })

  test('Promise compatibility', async () => {
    const result = await EitherAsync<string, never>(() => {
      throw 'Err'
    })

    const result2 = await EitherAsync<never, string>(async () => {
      return 'A'
    })

    expect(result).toEqual(Left('Err'))
    expect(result2).toEqual(Right('A'))
  })

  test('bimap', async () => {
    const newEitherAsync = EitherAsync(() => Promise.resolve(5)).bimap(
      (_) => 'left',
      (_) => 'right'
    )
    const newEitherAsync2 = EitherAsync(() => Promise.resolve(5))[
      'fantasy-land/bimap'
    ](
      (_) => 'left',
      (_) => 'right'
    )
    const newEitherAsync3 = EitherAsync(() => {
      throw ''
    }).bimap(
      (_) => 'left',
      (_) => 'right'
    )
    const newEitherAsync4 = EitherAsync(() => {
      throw ''
    })['fantasy-land/bimap'](
      (_) => 'left',
      (_) => 'right'
    )

    expect(await newEitherAsync.run()).toEqual(Right('right'))
    expect(await newEitherAsync2.run()).toEqual(Right('right'))
    expect(await newEitherAsync3.run()).toEqual(Left('left'))
    expect(await newEitherAsync4.run()).toEqual(Left('left'))
  })

  test('map', async () => {
    const newEitherAsync = EitherAsync(() => Promise.resolve(5)).map(
      (_) => 'val'
    )
    const newEitherAsync2 = EitherAsync(() => Promise.resolve(5))[
      'fantasy-land/map'
    ]((_) => 'val')

    expect(await newEitherAsync.run()).toEqual(Right('val'))
    expect(await newEitherAsync2.run()).toEqual(Right('val'))
  })

  test('mapLeft', async () => {
    const newEitherAsync = EitherAsync<number, never>(() =>
      Promise.reject(0)
    ).mapLeft((x) => x + 1)

    const newEitherAsync2 = EitherAsync<never, number>(() =>
      Promise.resolve(0)
    ).mapLeft((x) => x + 1)

    expect(await newEitherAsync.run()).toEqual(Left(1))
    expect(await newEitherAsync2.run()).toEqual(Right(0))
  })

  test('chain', async () => {
    const newEitherAsync = EitherAsync(() => Promise.resolve(5)).chain((_) =>
      EitherAsync(() => Promise.resolve('val'))
    )
    const newEitherAsync2 = EitherAsync(() => Promise.resolve(5))[
      'fantasy-land/chain'
    ]((_) => EitherAsync(() => Promise.resolve('val')))

    expect(await newEitherAsync.run()).toEqual(Right('val'))
    expect(await newEitherAsync2.run()).toEqual(Right('val'))
  })

  test('chain (with PromiseLike)', async () => {
    const newEitherAsync = EitherAsync(() => Promise.resolve(5)).chain((_) =>
      Promise.resolve(Right('val'))
    )
    const newEitherAsync2 = EitherAsync(() => Promise.resolve(5))[
      'fantasy-land/chain'
    ]((_) => Promise.resolve(Right('val')))

    expect(await newEitherAsync.run()).toEqual(Right('val'))
    expect(await newEitherAsync2.run()).toEqual(Right('val'))
  })

  test('chainLeft', async () => {
    const newEitherAsync = EitherAsync(() =>
      Promise.resolve(5)
    ).chainLeft((_) => EitherAsync(() => Promise.resolve(7)))
    const newEitherAsync2 = EitherAsync<number, number>(() =>
      Promise.reject(5)
    ).chainLeft((e) => EitherAsync(() => Promise.resolve(e + 1)))

    expect(await newEitherAsync.run()).toEqual(Right(5))
    expect(await newEitherAsync2.run()).toEqual(Right(6))
  })

  test('chainLeft (with PromiseLike)', async () => {
    const newEitherAsync = EitherAsync(() =>
      Promise.resolve(5)
    ).chainLeft((_) => Promise.resolve(Right(7)))
    const newEitherAsync2 = EitherAsync<number, number>(() =>
      Promise.reject(5)
    ).chainLeft((e) => Promise.resolve(Right(e + 1)))

    expect(await newEitherAsync.run()).toEqual(Right(5))
    expect(await newEitherAsync2.run()).toEqual(Right(6))
  })

  test('toMaybeAsync', async () => {
    const ma = EitherAsync(({ liftEither }) => liftEither(Left('123')))

    expect(await ma.toMaybeAsync().run()).toEqual(Nothing)

    const ma2 = EitherAsync(({ liftEither }) => liftEither(Right(5)))

    expect(await ma2.toMaybeAsync().run()).toEqual(Just(5))
  })

  test('swap', async () => {
    const eitherAsyncRight = EitherAsync(() => Promise.resolve(5))
    expect(await eitherAsyncRight.swap().run()).toEqual(Left(5))

    const eitherAsyncLeft = EitherAsync(async () => Promise.reject('fail'))
    expect(await eitherAsyncLeft.swap().run()).toEqual(Right('fail'))
  })

  test('ifLeft', async () => {
    let a = 0
    await EitherAsync.liftEither(Left('Error')).ifLeft(() => {
      a = 5
    })
    expect(a).toEqual(5)

    let b = 0
    await EitherAsync.liftEither(Right(5)).ifLeft(() => {
      b = 5
    })
    expect(b).toEqual(0)
  })

  test('ifRight', async () => {
    let a = 0
    await EitherAsync.liftEither(Left('Error')).ifRight(() => {
      a = 5
    })
    expect(a).toEqual(0)

    let b = 0
    await EitherAsync.liftEither(Right(5)).ifRight(() => {
      b = 5
    })
    expect(b).toEqual(5)
  })

  describe('run', () => {
    it('resolves to Left if any of the async Eithers are Left', async () => {
      expect(
        await EitherAsync(({ fromPromise }) =>
          fromPromise(Promise.resolve(Left('Error')))
        ).run()
      ).toEqual(Left('Error'))
    })

    it('resolves to a Left with the rejected value if there is a rejected promise', async () => {
      expect(
        await EitherAsync<void, never>(({ fromPromise }) =>
          fromPromise(Promise.reject('Some error'))
        ).run()
      ).toEqual(Left('Some error'))
    })

    it('resolves to Left with an exception if there is an exception thrown', async () => {
      expect(
        await EitherAsync(() => {
          throw new Error('!')
        }).run()
      ).toEqual(Left(Error('!')))
    })

    it('resolve to Right if the promise resolves successfully', async () => {
      expect(
        await EitherAsync(({ fromPromise }) =>
          fromPromise(Promise.resolve(Right(5)))
        ).run()
      ).toEqual(Right(5))
    })
  })

  test('leftOrDefault', async () => {
    const eitherAsyncRight = EitherAsync(() => Promise.resolve(5))
    expect(await eitherAsyncRight.leftOrDefault(5)).toEqual(5)

    const eitherAsyncLeft = EitherAsync(async () => Promise.reject('fail'))
    expect(await eitherAsyncLeft.leftOrDefault(5)).toEqual('fail')
  })

  test('orDefault', async () => {
    const eitherAsyncRight = EitherAsync(() => Promise.resolve(5))
    expect(await eitherAsyncRight.orDefault(10)).toEqual(5)

    const eitherAsyncLeft = EitherAsync<string, number>(async () =>
      Promise.reject('fail')
    )
    expect(await eitherAsyncLeft.orDefault(5)).toEqual(5)
  })

  test('join', async () => {
    const ea = EitherAsync(async () => 1).map((x) =>
      EitherAsync(async () => x + 1)
    )

    expect(await ea.join()).toEqual(Right(2))

    const ea2 = EitherAsync(async () => 1).map(() =>
      EitherAsync(async () => {
        throw 'Err'
      })
    )

    expect(await ea2.join()).toEqual(Left('Err'))

    const ea3 = EitherAsync(async () => {
      throw 'Err'
    })

    expect(await ea3.join()).toEqual(Left('Err'))
  })

  test('ap', async () => {
    expect(
      await EitherAsync.liftEither(Right(5)).ap(
        EitherAsync(async () => (x: number) => x + 1)
      )
    ).toEqual(Right(6))
    expect(
      await EitherAsync.liftEither(Right(5)).ap(
        EitherAsync(() => {
          throw 'Error'
        })
      )
    ).toEqual(Left('Error'))
    expect(
      await EitherAsync.liftEither(Left('Error')).ap(
        EitherAsync(async () => (x: number) => x + 1)
      )
    ).toEqual(Left('Error'))
    expect(
      await EitherAsync.liftEither(Left('Error')).ap(
        EitherAsync(() => {
          throw 'Function Error'
        })
      )
    ).toEqual(Left('Function Error'))

    expect(
      await EitherAsync.liftEither(Right(5))['fantasy-land/ap'](
        EitherAsync(async () => (x: number) => x + 1)
      )
    ).toEqual(Right(6))
  })

  test('alt', async () => {
    expect(
      await EitherAsync.liftEither(Left('Error')).alt(
        EitherAsync.liftEither(Left('Error!'))
      )
    ).toEqual(Left('Error!'))
    expect(
      await EitherAsync.liftEither(Left('Error')).alt(
        EitherAsync.liftEither(Right(5) as any)
      )
    ).toEqual(Right(5))
    expect(
      await EitherAsync.liftEither(Right(5)).alt(
        EitherAsync.liftEither(Left('Error') as any)
      )
    ).toEqual(Right(5))
    expect(
      await EitherAsync.liftEither(Right(5)).alt(
        EitherAsync.liftEither(Right(6))
      )
    ).toEqual(Right(5))

    expect(
      await EitherAsync.liftEither(Right(5))['fantasy-land/alt'](
        EitherAsync.liftEither(Right(6))
      )
    ).toEqual(Right(5))
  })

  test('extend', async () => {
    expect(
      await EitherAsync.liftEither<string, number>(Left('Error')).extend((x) =>
        x.orDefault(6)
      )
    ).toEqual(Left('Error'))
    expect(
      await EitherAsync.liftEither(Right(5)).extend((x) => x.orDefault(6))
    ).toEqual(Right(5))

    expect(
      await EitherAsync.liftEither(Right(5))['fantasy-land/extend']((x) =>
        x.orDefault(6)
      )
    ).toEqual(Right(5))
  })

  test('fromPromise static', async () => {
    expect(
      await EitherAsync.fromPromise(() => Promise.resolve(Right(5))).run()
    ).toEqual(Right(5))
    expect(
      await EitherAsync.fromPromise(() => Promise.reject(5)).run()
    ).toEqual(Left(5))
  })

  test('liftEither static', async () => {
    expect(await EitherAsync.liftEither(Right(5)).run()).toEqual(Right(5))
    expect(await EitherAsync.liftEither(Left(5)).run()).toEqual(Left(5))
  })

  test('lefts', async () => {
    expect(
      await EitherAsync.lefts([
        EitherAsync.liftEither(Left('Error')),
        EitherAsync.liftEither(Left('Error2')),
        EitherAsync.liftEither(Right(5))
      ])
    ).toEqual(['Error', 'Error2'])
  })

  test('rights', async () => {
    expect(
      await EitherAsync.rights([
        EitherAsync.liftEither(Right(10)),
        EitherAsync.liftEither(Left('Error')),
        EitherAsync.liftEither(Right(5))
      ])
    ).toEqual([10, 5])
  })

  test('sequence', async () => {
    expect(await EitherAsync.sequence([])).toEqual(Right([]))

    const uncalledFn = jest.fn()

    expect(
      await EitherAsync.sequence([
        EitherAsync(
          () =>
            new Promise((_, reject) => {
              setTimeout(() => {
                reject('A')
              }, 200)
            })
        ),
        EitherAsync(uncalledFn)
      ])
    ).toEqual(Left('A'))

    expect(uncalledFn).toHaveBeenCalledTimes(0)

    const calledFn = jest.fn()

    expect(
      await EitherAsync.sequence([
        EitherAsync.liftEither(Right(1)),
        EitherAsync(async () => {
          calledFn()
          return 2
        })
      ])
    ).toEqual(Right([1, 2]))

    expect(calledFn).toHaveBeenCalledTimes(1)
  })

  test('throwing in some method', async () => {
    const ea = EitherAsync(async () => 5).map(() => {
      throw 'AAA'
    })

    expect(await ea).toEqual(Left('AAA'))
  })

  test('all static', async () => {
    expect(
      await EitherAsync.all([
        EitherAsync.liftEither(Right(1)),
        EitherAsync.liftEither(Right(2))
      ]).run()
    ).toEqual(Right([1, 2]))

    expect(
      await EitherAsync.all2([
        EitherAsync.liftEither(Right(1)),
        EitherAsync.liftEither(Right('hello'))
      ]).run()
    ).toEqual(Right([1, 'hello']))
  })
})
