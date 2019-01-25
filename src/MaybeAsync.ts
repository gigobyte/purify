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
  of<T>(promise: PromiseLike<Maybe<T>>): PromiseLike<T>
}

const maybeAsyncInstances: MaybeAsyncInstances = {
  liftMaybe<T>(maybe: Maybe<T>): PromiseLike<T> {
    if (maybe.isNothing()) {
      throw Nothing
    }

    return Promise.resolve(maybe.__value)
  },

  of<T>(promise: PromiseLike<Maybe<T>>): PromiseLike<T> {
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
  MaybeAsync(async ({ liftMaybe, of }) => {
    const dateNow = await getCurrentTime()
    const body = await liftMaybe(parseBody(rawBody))
    const user = await of(getUser(body, dateNow))

    return await insertUser(user)
  }).run()

const registerChain = (rawBody: string): Promise<Maybe<InsertedUser>> =>
  MaybeAsync(({ liftMaybe, of }) =>
    Promise.all([getCurrentTime(), liftMaybe(parseBody(rawBody))])
      .then(([dateNow, body]) => of(getUser(body, dateNow)))
      .then(insertUser)
  ).run()
