import { Either, Left, Right } from './Either'

export interface EitherAsync<L, R> {
  run(): Promise<Either<L, R>>
  map<R2>(f: (value: R) => R2): EitherAsync<L, R2>
  chain<R2>(f: (value: R) => EitherAsync<L, R2>): EitherAsync<L, R2>
}

export interface EitherAsyncValue<R> extends PromiseLike<R> {}

export interface MaybeAsyncHelpers<L> {
  liftEither<R>(either: Either<L, R>): EitherAsyncValue<R>
  fromPromise<R>(promise: PromiseLike<Either<L, R>>): EitherAsyncValue<R>
}

const helpers: MaybeAsyncHelpers<any> = {
  liftEither<L, R>(either: Either<L, R>): EitherAsyncValue<R> {
    if (either.isLeft()) {
      throw either.__value
    }

    return Promise.resolve(either.__value as R)
  },

  fromPromise<L, R>(promise: PromiseLike<Either<L, R>>): EitherAsyncValue<R> {
    return promise.then(helpers.liftEither) as any
  }
}

export const EitherAsync = <L, R>(
  runPromise: (helpers: MaybeAsyncHelpers<L>) => PromiseLike<R>
): EitherAsync<L, R> => ({
  async run(): Promise<Either<L, R>> {
    try {
      return Right(await runPromise(helpers))
    } catch (e) {
      return Left(e)
    }
  },
  map<R2>(f: (value: R) => R2): EitherAsync<L, R2> {
    return EitherAsync(helpers => runPromise(helpers).then(f))
  },
  chain<R2>(f: (value: R) => EitherAsync<L, R2>): EitherAsync<L, R2> {
    return EitherAsync(async helpers => {
      const value = await runPromise(helpers)
      return await helpers.fromPromise(f(value).run())
    })
  }
})

const test = EitherAsync(() => Promise.reject())
;(async () => {
  console.log(await test.run())
})()
