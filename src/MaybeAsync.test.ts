import { MaybeAsync, liftPromise, fromPromise, liftMaybe } from './MaybeAsync'
import { Just, Nothing } from './Maybe'
import { Left, Right } from './Either'

describe('MaybeAsync', () => {
  test('liftMaybe', () => {
    MaybeAsync(async ({ liftMaybe }) => {
      const _: 5 = await liftMaybe(Just<5>(5))
    })
  })

  test('fromPromise', () => {
    MaybeAsync(async ({ fromPromise }) => {
      const _: 5 = await fromPromise(Promise.resolve(Just<5>(5)))
    })
  })

  test('map', async () => {
    const newMaybeAsync = MaybeAsync(() => Promise.resolve(5)).map((_) => 'val')
    const newMaybeAsync2 = MaybeAsync(() => Promise.resolve(5))[
      'fantasy-land/map'
    ]((_) => 'val')

    expect(await newMaybeAsync.run()).toEqual(Just('val'))
    expect(await newMaybeAsync2.run()).toEqual(Just('val'))
  })

  test('chain', async () => {
    const newMaybeAsync = MaybeAsync(() => Promise.resolve(5)).chain((_) =>
      MaybeAsync(() => Promise.resolve('val'))
    )
    const newMaybeAsync2 = MaybeAsync(() => Promise.resolve(5))[
      'fantasy-land/chain'
    ]((_) => MaybeAsync(() => Promise.resolve('val')))

    expect(await newMaybeAsync.run()).toEqual(Just('val'))
    expect(await newMaybeAsync2.run()).toEqual(Just('val'))
  })

  test('toEitherAsync', async () => {
    const ma = MaybeAsync(({ liftMaybe }) => liftMaybe(Nothing))

    expect(await ma.toEitherAsync('Error').run()).toEqual(Left('Error'))

    const ma2 = MaybeAsync(({ liftMaybe }) => liftMaybe(Just(5)))

    expect(await ma2.toEitherAsync('Error').run()).toEqual(Right(5))
  })

  describe('run', () => {
    it('resolves to Nothing if any of the async Maybes are Nothing', async () => {
      expect(
        await MaybeAsync(({ liftMaybe }) => liftMaybe(Nothing)).run()
      ).toEqual(Nothing)
    })

    it('resolves to Nothing if there is a rejected promise', async () => {
      expect(await MaybeAsync(() => Promise.reject()).run()).toEqual(Nothing)
    })

    it('resolves to Nothing if there is an exception thrown', async () => {
      expect(
        await MaybeAsync(() => {
          throw new Error('!')
        }).run()
      ).toEqual(Nothing)
    })

    it('resolve to Just if the promise resolves successfully', async () => {
      expect(
        await MaybeAsync(({ fromPromise }) =>
          fromPromise(Promise.resolve(Just(5)))
        ).run()
      ).toEqual(Just(5))
    })
  })

  test('fromPromise export', async () => {
    expect(await fromPromise(() => Promise.resolve(Just(5))).run()).toEqual(
      Just(5)
    )
    expect(await fromPromise(() => Promise.reject()).run()).toEqual(Nothing)
  })

  test('liftPromise export', async () => {
    expect(await liftPromise(() => Promise.resolve(5)).run()).toEqual(Just(5))
    expect(await liftPromise(() => Promise.reject()).run()).toEqual(Nothing)
  })

  test('liftEither export', async () => {
    expect(await liftMaybe(Just(5)).run()).toEqual(Just(5))
    expect(await liftMaybe(Nothing).run()).toEqual(Nothing)
  })
})
