import { Maybe, Just, Nothing } from './Maybe'

interface User {
  id: number
  createdOn: number
}

interface InsertedUser extends User {
  __id: string
}

interface MaybeAsync<T> {
  run(): Promise<Maybe<T>>
}

interface MaybeAsyncInstances {
  liftMaybe<T>(maybe: Maybe<T>): PromiseLike<T>
  fromPromise<T>(promise: PromiseLike<Maybe<T>>): PromiseLike<T>
}

const maybeAsyncInstances: MaybeAsyncInstances = {
  liftMaybe<T>(maybe: Maybe<T>): PromiseLike<T> {
    if (maybe.isNothing()) {
      throw Nothing
    }

    return Promise.resolve(maybe.__value)
  },

  fromPromise<T>(promise: PromiseLike<Maybe<T>>): PromiseLike<T> {
    return promise.then(maybeAsyncInstances.liftMaybe)
  }
}

const MaybeAsync = <T>(
  promise: (maybeAsyncInstances: MaybeAsyncInstances) => Promise<T>
): MaybeAsync<T> => ({
  async run(): Promise<Maybe<T>> {
    try {
      return Just(await promise(maybeAsyncInstances))
    } catch {
      return Nothing
    }
  }
})

const getCurrentTime = (): Promise<number> => Promise.resolve(Date.now())
const parseBody = (usrId: string): Maybe<number> =>
  Maybe.fromFalsy(Number(usrId))
const getUser = (userId: number, dateNow: number): Promise<Maybe<User>> =>
  Promise.resolve(Maybe.of({ id: userId, createdOn: dateNow }))
const insertUser = (user: User): Promise<InsertedUser> =>
  Promise.resolve({ ...user, __id: '' })

const register = (rawBody: string): Promise<Maybe<InsertedUser>> =>
  MaybeAsync(async ({ liftMaybe, fromPromise }) => {
    const dateNow = await getCurrentTime()
    const body = await liftMaybe(parseBody(rawBody))
    const user = await fromPromise(getUser(body, dateNow))

    return insertUser(user)
  }).run()
