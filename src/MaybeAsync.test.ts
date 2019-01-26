import './customMatchers'
import { MaybeAsync } from './MaybeAsync'
import { Just, Nothing } from './Maybe'

describe('MaybeAsync', () => {
  test('liftMaybe', () => {
    MaybeAsync(async ({ liftMaybe }) => {
      const value: 5 = await liftMaybe(Just<5>(5))
    })
  })

  test('fromPromise', () => {
    MaybeAsync(async ({ fromPromise }) => {
      const value: 5 = await fromPromise(Promise.resolve(Just<5>(5)))
    })
  })

  test('map', async () => {
    const newMaybeAsync = MaybeAsync(() => Promise.resolve(5)).map(_ => 'val')

    expect(await newMaybeAsync.run()).toEqualStringified(Just('val'))
  })

  test('chain', async () => {
    const newMaybeAsync = MaybeAsync(() => Promise.resolve(5)).chain(_ =>
      MaybeAsync(() => Promise.resolve('val'))
    )

    expect(await newMaybeAsync.run()).toEqualStringified(Just('val'))
  })

  describe('run', () => {
    it('resolves to Nothing if any of the async Maybes are Nothing', async () => {
      expect(
        await MaybeAsync(({ fromPromise }) =>
          fromPromise(Promise.resolve(Nothing))
        ).run()
      ).toEqual(Nothing)
    })

    it('resolves to Nothing if there is a rejected promise', async () => {
      expect(
        await MaybeAsync(({ fromPromise }) =>
          fromPromise(Promise.reject())
        ).run()
      ).toEqual(Nothing)
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
      ).toEqualStringified(Just(5))
    })
  })
})
