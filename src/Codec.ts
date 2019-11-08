// import * as t from 'io-ts'
import { Either, Right, Left } from './Either'
import { identity } from './Function'

interface Codec<T> {
  /** Used for TypeScript interface generation */
  _: T
  decode: (value: unknown) => Either<string, T>
  encode: (value: T) => T
}

type Interface<T extends Codec<any>> = {
  [k in keyof T['_']]: T['_'][k]
}

const Codec = {
  interface<T extends Record<string, Codec<any>>>(
    properties: T
  ): Codec<
    {
      [k in keyof T]: T[k]['_']
    }
  > {
    return {
      decode: (input: any) => {
        const result = {} as { [k in keyof T]: T[k]['_'] }
        const keys = Object.keys(properties)

        for (const key of keys) {
          const decodedProperty = properties[key].decode(input[key])

          if (decodedProperty.isLeft()) {
            return Left('fail')
          }

          result[key as keyof T] = decodedProperty.extract()
        }

        return Right(result)
      },
      encode: (input: any) => {
        const result = {} as { [k in keyof T]: T[k]['_'] }
        const keys = Object.keys(properties)

        for (const key of keys) {
          result[key as keyof T] = properties[key].encode(input[key])
        }

        return result
      }
    } as Codec<
      {
        [k in keyof T]: T[k]['_']
      }
    >
  },

  custom<T>({
    decode,
    encode
  }: {
    decode: (value: unknown) => Either<string, T>
    encode: (value: T) => any
  }): Codec<T> {
    return {
      decode,
      encode
    } as Codec<T>
  }
}

const string = Codec.custom<string>({
  decode: input => (typeof input === 'string' ? Right(input) : Left('fail')),
  encode: identity
})

const number = Codec.custom<number>({
  decode: input => (typeof input === 'number' ? Right(input) : Left('fail')),
  encode: identity
})

// ------------------------------------------

// const User = Codec.interface({
//   userId: number,
//   name: string
// })

// type User = Interface<typeof User>

// const User2 = t.type({
//   userId: t.number,
//   name: t.string
// })

// type User2 = t.TypeOf<typeof User2>

// const u = User.decode({ userId: 2, name: 'dsa', dasda: 5 })
// const u2 = User2.decode({ userId: 2, name: 'dsa', dasda: 5 })

// console.log(u)
// console.log(u2)
