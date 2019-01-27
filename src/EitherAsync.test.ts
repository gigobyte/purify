import './customMatchers'
import { EitherAsync } from './EitherAsync'
import { Left, Right } from './Either'

describe('EitherAsync', () => {
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

  test('map', async () => {
    const newEitherAsync = EitherAsync(() => Promise.resolve(5)).map(_ => 'val')

    expect(await newEitherAsync.run()).toEqualStringified(Right('val'))
  })

  test('chain', async () => {
    const newEitherAsync = EitherAsync(() => Promise.resolve(5)).chain(_ =>
      EitherAsync(() => Promise.resolve('val'))
    )

    expect(await newEitherAsync.run()).toEqualStringified(Right('val'))
  })

  describe('run', () => {
    it('resolves to Left if any of the async Eithers are Left', async () => {
      expect(
        await EitherAsync(({ fromPromise }) =>
          fromPromise(Promise.resolve(Left('Error')))
        ).run()
      ).toEqualStringified(Left('Error'))
    })

    it('resolves to a Left with the rejected value if there is a rejected promise', async () => {
      expect(
        await EitherAsync<void, never>(({ fromPromise }) =>
          fromPromise(Promise.reject('Some error'))
        ).run()
      ).toEqualStringified(Left('Some error'))
    })

    it('resolves to Left with an exception if there is an exception thrown', async () => {
      expect(
        await EitherAsync(() => {
          throw new Error('!')
        }).run()
      ).toEqualStringified(Left(Error('!')))
    })

    it('resolve to Right if the promise resolves successfully', async () => {
      expect(
        await EitherAsync(({ fromPromise }) =>
          fromPromise(Promise.resolve(Right(5)))
        ).run()
      ).toEqualStringified(Right(5))
    })
  })
})
