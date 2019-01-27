import { Either, Left, Right } from './Either'
import { MaybeAsync } from './MaybeAsync'

export interface EitherAsync<L, R> {
  /**
   * It's important to remember how `run` will behave because in an
   * async context there are other ways for a function to fail other
   * than to return a Nothing, for example:
   * If any of the computations inside EitherAsync resolved to a Left,
   * `run` will return a Promise resolved to that Left.
   * If any of the promises were to be rejected then `run` will return
   * a Promise resolved to a Left with the rejection value inside
   * If an exception is thrown then `run` will return a Promise
   * resolved to a Left with the exception inside
   * If none of the above happen then a promise resolved to the
   * returned value wrapped in a Right will be returned
   */
  run(): Promise<Either<L, R>>
  /** Transforms the the `Right` value of `this` with a given function. If the EitherAsync that is being mapped resolves to a Left then the mapping function won't be called and `run` will resolve the whole thing to that Left, just like the regular Either#map */
  map<R2>(f: (value: R) => R2): EitherAsync<L, R2>
  /** Transforms `this` with a function that returns a `EitherAsync`. Behaviour is the same as the regular Either#chain */
  chain<R2>(f: (value: R) => EitherAsync<L, R2>): EitherAsync<L, R2>
  /** Convert `this` to a MaybeAsync, discarding any error values */
  toMaybeAsync(): MaybeAsync<R>
}

export interface EitherAsyncValue<R> extends PromiseLike<R> {}

export interface EitherAsyncHelpers<L> {
  /** Allows you to take a regular Either value and lift it to the EitherAsync context. Awaiting a lifted Either will give you the `Right` value inside. If the Either is Left then the function will exit immediately and EitherAsync will resolve to that Left after running it */
  liftEither<R>(either: Either<L, R>): EitherAsyncValue<R>
  /** Allows you to take an Either inside a Promise and lift it to the EitherAsync context. Awaiting a lifted Promise<Either> will give you the `Right` value inside the Either. If the Either is Left or the Promise is rejected then the function will exit immediately and MaybeAsync will resolve to that Left or the rejection value after running it */
  fromPromise<R>(promise: PromiseLike<Either<L, R>>): EitherAsyncValue<R>
  /** A type safe version of throwing an exception. Unlike the Error constructor, which will take anything, throwE only accepts values of the same type as the Left part of the Either */
  throwE(error: L): never
}

const helpers: EitherAsyncHelpers<any> = {
  liftEither<L, R>(either: Either<L, R>): EitherAsyncValue<R> {
    if (either.isLeft()) {
      throw either.__value
    }

    return Promise.resolve(either.__value as R)
  },

  fromPromise<L, R>(promise: PromiseLike<Either<L, R>>): EitherAsyncValue<R> {
    return promise.then(helpers.liftEither) as any
  },

  throwE<L>(error: L): never {
    throw error
  }
}

/** Constructs a EitherAsync object from a function that takes an object full of helpers that let you lift things into the EitherAsync context and returns a Promise */
export const EitherAsync = <L, R>(
  runPromise: (helpers: EitherAsyncHelpers<L>) => PromiseLike<R>
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
  },
  toMaybeAsync(): MaybeAsync<R> {
    return MaybeAsync(async ({ liftMaybe }) => {
      const either = await this.run()
      return liftMaybe(either.toMaybe())
    })
  }
})
