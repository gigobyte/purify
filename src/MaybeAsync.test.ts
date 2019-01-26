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

  describe('run', () => {
    it('resolves to Nothing if any of the async Maybes are Nothing', async () => {
      const a = await MaybeAsync(({ fromPromise }) =>
        fromPromise(Promise.resolve(Nothing))
      ).run()
      expect(a).toEqual(Nothing)
    })
  })
})
