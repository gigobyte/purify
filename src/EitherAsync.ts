import { Either, EitherPatterns, Left, Right } from './Either'
import { MaybeAsync } from './MaybeAsync'

export interface EitherAsyncTypeRef {
  /** Constructs an `EitherAsync` object from a function that takes an object full of helpers that let you lift things into the `EitherAsync` context and returns a Promise */
  <L, R>(
    runPromise: (helpers: EitherAsyncHelpers<L>) => PromiseLike<R>
  ): EitherAsync<L, R>
  /** Constructs an `EitherAsync` object from a function that returns an Either wrapped in a Promise */
  fromPromise<L, R>(f: () => PromiseLike<Either<L, R>>): EitherAsync<L, R>
  /** Constructs an `EitherAsync` object from an Either */
  liftEither<L, R>(either: Either<L, R>): EitherAsync<L, R>
  /** Takes a list of `EitherAsync`s and returns a Promise that will resolve with all `Left` values. Internally it uses `Promise.all` to wait for all results */
  lefts<L, R>(list: EitherAsync<L, R>[]): Promise<L[]>
  /** Takes a list of `EitherAsync`s and returns a Promise that will resolve with all `Right` values. Internally it uses `Promise.all` to wait for all results */
  rights<L, R>(list: EitherAsync<L, R>[]): Promise<R[]>
  /** Turns a list of `EitherAsync`s into an `EitherAsync` of list. The returned `Promise` will be rejected as soon as a single `EitherAsync` resolves to a `Left`, it will not wait for all Promises to resolve and since `EitherAsync` is lazy, unlike `Promise`, the remaining async operations will not be executed at all */
  sequence<L, R>(eas: EitherAsync<L, R>[]): EitherAsync<L, R[]>
  /** The same as `EitherAsync.sequence`, but it will run all async operations at the same time rather than sequentially */
  all<L, R>(eas: EitherAsync<L, R>[]): EitherAsync<L, R[]>
}

export interface EitherAsync<L, R> extends PromiseLike<Either<L, R>> {
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
  /** Given two functions, maps the value that the Promise inside `this` resolves to using the first if it is `Left` or using the second one if it is `Right` */
  bimap<L2, R2>(f: (value: L) => L2, g: (value: R) => R2): EitherAsync<L2, R2>
  /** Transforms the `Right` value of `this` with a given function. If the `EitherAsync` that is being mapped resolves to a Left then the mapping function won't be called and `run` will resolve the whole thing to that Left, just like the regular Either#map */
  map<R2>(f: (value: R) => R2): EitherAsync<L, R2>
  /** Maps the `Left` value of `this`, acts like an identity if `this` is `Right` */
  mapLeft<L2>(f: (value: L) => L2): EitherAsync<L2, R>
  /** Transforms `this` with a function that returns a `EitherAsync`. Behaviour is the same as the regular Either#chain */
  chain<L2, R2>(
    f: (value: R) => PromiseLike<Either<L2, R2>>
  ): EitherAsync<L | L2, R2>
  /** The same as EitherAsync#chain but executes the transformation function only if the value is Left. Useful for recovering from errors */
  chainLeft<L2, R2>(
    f: (value: L) => PromiseLike<Either<L2, R2>>
  ): EitherAsync<L2, R | R2>
  /** Flattens nested `EitherAsync`s. `e.join()` is equivalent to `e.chain(x => x)` */
  join<L2, R2>(
    this: EitherAsync<L, EitherAsync<L2, R2>>
  ): EitherAsync<L | L2, R2>
  /** Converts `this` to a MaybeAsync, discarding any error values */
  toMaybeAsync(): MaybeAsync<R>
  /** Returns `Right` if `this` is `Left` and vice versa */
  swap(): EitherAsync<R, L>
  /** Runs an effect if `this` is `Left`, returns `this` to make chaining other methods possible */
  ifLeft(effect: (value: L) => any): EitherAsync<L, R>
  /** Runs an effect if `this` is `Right`, returns `this` to make chaining other methods possible */
  ifRight(effect: (value: R) => any): EitherAsync<L, R>
  /** Applies a `Right` function wrapped in `EitherAsync` over a future `Right` value. Returns `Left` if either the `this` resolves to a `Left` or the function is `Left` */
  ap<L2, R2>(
    other: PromiseLike<Either<L2, (value: R) => R2>>
  ): EitherAsync<L | L2, R2>
  /** Returns the first `Right` between the future value of `this` and another `EitherAsync` or the `Left` in the argument if both `this` and the argument resolve to `Left` */
  alt(other: EitherAsync<L, R>): EitherAsync<L, R>
  /** Returns `this` if it resolves to a `Left`, otherwise it returns the result of applying the function argument to `this` and wrapping it in a `Right` */
  extend<R2>(f: (value: EitherAsync<L, R>) => R2): EitherAsync<L, R2>
  /** Returns a Promise that resolves to the value inside `this` if it\'s `Left` or a default value if `this` is `Right` */
  leftOrDefault(defaultValue: L): Promise<L>
  /** Returns a Promise that resolves to the value inside `this` if it\'s `Right` or a default value if `this` is `Left` */
  orDefault(defaultValue: R): Promise<R>
  /** Useful if you are not interested in the result of an operation */
  void(): EitherAsync<L, void>
  /** Structural pattern matching for `EitherAsync` in the form of a function */
  caseOf<T>(patterns: EitherPatterns<L, R, T>): Promise<T>
  /* Similar to the Promise method of the same name, the provided function is called when the `EitherAsync` is executed regardless of whether the `Either` result is `Left` or `Right` */
  finally(effect: () => any): EitherAsync<L, R>

  'fantasy-land/map'<R2>(f: (value: R) => R2): EitherAsync<L, R2>
  'fantasy-land/bimap'<L2, R2>(
    f: (value: L) => L2,
    g: (value: R) => R2
  ): EitherAsync<L2, R2>
  'fantasy-land/chain'<R2>(
    f: (value: R) => PromiseLike<Either<L, R2>>
  ): EitherAsync<L, R2>
  'fantasy-land/ap'<R2>(
    other: EitherAsync<L, (value: R) => R2>
  ): EitherAsync<L, R2>
  'fantasy-land/alt'(other: EitherAsync<L, R>): EitherAsync<L, R>
  'fantasy-land/extend'<R2>(
    f: (value: EitherAsync<L, R>) => R2
  ): EitherAsync<L, R2>
  /** WARNING: This is implemented only for Promise compatibility. Please use `chain` instead. */
  then: PromiseLike<Either<L, R>>['then']
}

export interface EitherAsyncValue<R> extends PromiseLike<R> {}

export interface EitherAsyncHelpers<L> {
  /** Allows you to take a regular Either value and lift it to the `EitherAsync` context. Awaiting a lifted Either will give you the `Right` value inside. If the Either is Left then the function will exit immediately and EitherAsync will resolve to that Left after running it */
  liftEither<R>(either: Either<L, R>): EitherAsyncValue<R>
  /** Allows you to take an Either inside a Promise and lift it to the `EitherAsync` context. Awaiting a lifted Promise<Either> will give you the `Right` value inside the Either. If the Either is Left or the Promise is rejected then the function will exit immediately and MaybeAsync will resolve to that Left or the rejection value after running it */
  fromPromise<R>(promise: PromiseLike<Either<L, R>>): EitherAsyncValue<R>
  /** A type safe version of throwing an exception. Unlike the Error constructor, which will take anything, throwE only accepts values of the same type as the Left part of the Either */
  throwE(error: L): never
}

const helpers: EitherAsyncHelpers<any> = {
  liftEither<L, R>(either: Either<L, R>): EitherAsyncValue<R> {
    if (either.isRight()) {
      return Promise.resolve(either.extract())
    }

    throw either.extract()
  },
  fromPromise<L, R>(promise: PromiseLike<Either<L, R>>): EitherAsyncValue<R> {
    return promise.then(helpers.liftEither) as EitherAsyncValue<R>
  },
  throwE<L>(error: L): never {
    throw error
  }
}

class EitherAsyncImpl<L, R> implements EitherAsync<L, R> {
  [Symbol.toStringTag]: 'EitherAsync' = 'EitherAsync'

  constructor(
    private runPromise: (helpers: EitherAsyncHelpers<L>) => PromiseLike<R>
  ) {}

  leftOrDefault(defaultValue: L): Promise<L> {
    return this.run().then((x) => x.leftOrDefault(defaultValue))
  }

  orDefault(defaultValue: R): Promise<R> {
    return this.run().then((x) => x.orDefault(defaultValue))
  }

  join<L2, R2>(
    this: EitherAsync<L, EitherAsync<L2, R2>>
  ): EitherAsync<L | L2, R2> {
    return EitherAsync(async (helpers) => {
      const either = await this
      if (either.isRight()) {
        const nestedEither = await either.extract()
        return helpers.liftEither(nestedEither)
      }
      return helpers.liftEither(either as any as Either<L, R2>)
    })
  }

  ap<L2, R2>(
    eitherF: PromiseLike<Either<L2, (value: R) => R2>>
  ): EitherAsync<L | L2, R2> {
    return EitherAsync(async (helpers) => {
      const otherValue = await eitherF

      if (otherValue.isRight()) {
        const thisValue = await this

        if (thisValue.isRight()) {
          return otherValue.extract()(thisValue.extract())
        } else {
          return helpers.liftEither(thisValue as any as Either<L, R2>)
        }
      }

      return helpers.liftEither(otherValue as any as Either<L, R2>)
    })
  }

  alt(other: EitherAsync<L, R>): EitherAsync<L, R> {
    return EitherAsync(async (helpers) => {
      const thisValue = await this

      if (thisValue.isRight()) {
        return thisValue.extract()
      } else {
        const otherValue = await other
        return helpers.liftEither(otherValue)
      }
    })
  }

  extend<R2>(f: (value: EitherAsync<L, R>) => R2): EitherAsync<L, R2> {
    return EitherAsync(async (helpers) => {
      const either = await this.run()
      if (either.isRight()) {
        const v = EitherAsync.liftEither(either)
        return helpers.liftEither(Right(f(v)))
      }
      return helpers.liftEither(either as any as Either<L, R2>)
    })
  }

  async run(): Promise<Either<L, R>> {
    try {
      return Right(await this.runPromise(helpers))
    } catch (e: any) {
      return Left(e)
    }
  }

  bimap<L2, R2>(f: (value: L) => L2, g: (value: R) => R2): EitherAsync<L2, R2> {
    return EitherAsync(async (helpers) => {
      const either = await this.run()
      return helpers.liftEither(either.bimap(f, g))
    })
  }

  map<R2>(f: (value: R) => R2): EitherAsync<L, R2> {
    return EitherAsync((helpers) => this.runPromise(helpers).then(f))
  }

  mapLeft<L2>(f: (value: L) => L2): EitherAsync<L2, R> {
    return EitherAsync(async (helpers) => {
      try {
        return await this.runPromise(helpers as any as EitherAsyncHelpers<L>)
      } catch (e: any) {
        throw f(e)
      }
    })
  }

  chain<L2, R2>(
    f: (value: R) => PromiseLike<Either<L2, R2>>
  ): EitherAsync<L | L2, R2> {
    return EitherAsync(async (helpers) => {
      const value = await this.runPromise(helpers)
      return helpers.fromPromise(f(value))
    })
  }

  chainLeft<L2, R2>(
    f: (value: L) => PromiseLike<Either<L2, R2>>
  ): EitherAsync<L2, R | R2> {
    return EitherAsync(async (helpers) => {
      try {
        return await this.runPromise(helpers as any as EitherAsyncHelpers<L>)
      } catch (e: any) {
        return helpers.fromPromise(f(e))
      }
    })
  }

  toMaybeAsync(): MaybeAsync<R> {
    return MaybeAsync(async ({ liftMaybe }) => {
      const either = await this.run()
      return liftMaybe(either.toMaybe())
    })
  }

  swap(): EitherAsync<R, L> {
    return EitherAsync(async (helpers) => {
      const either = await this.run()
      if (either.isRight()) helpers.throwE(either.extract() as R)
      return helpers.liftEither(Right(either.extract() as L))
    })
  }

  ifLeft(effect: (value: L) => any): EitherAsync<L, R> {
    return EitherAsync(async (helpers) => {
      const either = await this.run()
      either.ifLeft(effect)
      return helpers.liftEither(either)
    })
  }

  ifRight(effect: (value: R) => any): EitherAsync<L, R> {
    return EitherAsync(async (helpers) => {
      const either = await this.run()
      either.ifRight(effect)
      return helpers.liftEither(either)
    })
  }

  void(): EitherAsync<L, void> {
    return this.map((_) => {})
  }

  caseOf<T>(patterns: EitherPatterns<L, R, T>): Promise<T> {
    return this.run().then((x) => x.caseOf(patterns))
  }

  finally(effect: () => any): EitherAsync<L, R> {
    return EitherAsync(({ fromPromise }) =>
      fromPromise(this.run().finally(effect))
    )
  }

  'fantasy-land/map' = this.map
  'fantasy-land/bimap' = this.bimap
  'fantasy-land/chain' = this.chain
  'fantasy-land/ap' = this.ap
  'fantasy-land/extend' = this.extend
  'fantasy-land/alt' = this.alt

  then: PromiseLike<Either<L, R>>['then'] = (onfulfilled, onrejected) => {
    return this.run().then(onfulfilled, onrejected)
  }
}

export const EitherAsync: EitherAsyncTypeRef = Object.assign(
  <L, R>(
    runPromise: (helpers: EitherAsyncHelpers<L>) => PromiseLike<R>
  ): EitherAsync<L, R> => new EitherAsyncImpl(runPromise),
  {
    fromPromise: <L, R>(
      f: () => PromiseLike<Either<L, R>>
    ): EitherAsync<L, R> => EitherAsync(({ fromPromise: fP }) => fP(f())),
    liftEither: <L, R>(either: Either<L, R>): EitherAsync<L, R> =>
      EitherAsync(({ liftEither }) => liftEither(either)),
    lefts: <L, R>(list: EitherAsync<L, R>[]): Promise<L[]> =>
      Promise.all(list.map((x) => x.run())).then(Either.lefts),
    rights: <L, R>(list: EitherAsync<L, R>[]): Promise<R[]> =>
      Promise.all(list.map((x) => x.run())).then(Either.rights),
    sequence: <L, R>(eas: EitherAsync<L, R>[]): EitherAsync<L, R[]> =>
      EitherAsync(async (helpers) => {
        let res: R[] = []

        for await (const e of eas) {
          if (e.isLeft()) {
            return helpers.liftEither(e)
          }

          res.push(e.extract() as R)
        }

        return helpers.liftEither(Right(res))
      }),
    all: <L, R>(eas: EitherAsync<L, R>[]): EitherAsync<L, R[]> =>
      EitherAsync.fromPromise(async () =>
        Promise.all(eas).then(Either.sequence)
      )
  }
)

EitherAsyncImpl.prototype.constructor = EitherAsync
