import { Maybe, Just, Nothing } from './Maybe'

export interface MaybeAsync<T> {
  run(): Promise<Maybe<T>>
  map<U>(f: (value: T) => U): MaybeAsync<U>
  chain<U>(f: (value: T) => MaybeAsync<U>): MaybeAsync<U>
}

export interface MaybeAsyncValue<T> extends PromiseLike<T> {}

export interface MaybeAsyncHelpers {
  liftMaybe<T>(maybe: Maybe<T>): MaybeAsyncValue<T>
  fromPromise<T>(promise: PromiseLike<Maybe<T>>): MaybeAsyncValue<T>
}

const helpers: MaybeAsyncHelpers = {
  liftMaybe<T>(maybe: Maybe<T>): MaybeAsyncValue<T> {
    if (maybe.isNothing()) {
      throw Nothing
    }

    return Promise.resolve(maybe.__value)
  },

  fromPromise<T>(promise: PromiseLike<Maybe<T>>): MaybeAsyncValue<T> {
    return promise.then(helpers.liftMaybe) as any
  }
}

export const MaybeAsync = <T>(
  runPromise: (helpers: MaybeAsyncHelpers) => PromiseLike<T>
): MaybeAsync<T> => ({
  async run(): Promise<Maybe<T>> {
    try {
      return Just(await runPromise(helpers))
    } catch {
      return Nothing
    }
  },
  map<U>(f: (value: T) => U): MaybeAsync<U> {
    return MaybeAsync(helpers => runPromise(helpers).then(f))
  },
  chain<U>(f: (value: T) => MaybeAsync<U>): MaybeAsync<U> {
    return MaybeAsync(async helpers => {
      const value = await runPromise(helpers)
      return await helpers.fromPromise(f(value).run())
    })
  }
})
