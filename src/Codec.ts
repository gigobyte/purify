import { Either, Right, Left } from './Either'
import { identity } from './Function'

export interface Codec<T> {
  decode: (input: unknown) => Either<string, T>
  encode: (input: T) => T
}

export type GetInterface<T extends Codec<any>> = T extends Codec<infer U>
  ? U
  : never

export const Codec = {
  interface<T extends Record<string, Codec<any>>>(
    properties: T
  ): Codec<
    {
      [k in keyof T]: GetInterface<T[k]>
    }
  > {
    return {
      decode: (input: any) => {
        const result = {} as { [k in keyof T]: GetInterface<T[k]> }
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
        const result = {} as { [k in keyof T]: GetInterface<T[k]> }
        const keys = Object.keys(properties)

        for (const key of keys) {
          result[key as keyof T] = properties[key].encode(input[key])
        }

        return result
      }
    } as Codec<
      {
        [k in keyof T]: GetInterface<T[k]>
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

export const string = Codec.custom<string>({
  decode: input => (typeof input === 'string' ? Right(input) : Left('fail')),
  encode: identity
})

export const number = Codec.custom<number>({
  decode: input => (typeof input === 'number' ? Right(input) : Left('fail')),
  encode: identity
})

export const nullType = Codec.custom<null>({
  decode: input => (input === null ? Right(input) : Left('fail')),
  encode: identity
})

export const undefinedType = Codec.custom<undefined>({
  decode: input => (input === undefined ? Right(input) : Left('fail')),
  encode: identity
})

export const oneOf = <T extends Array<Codec<any>>>(
  codecs: T
): Codec<GetInterface<T extends Array<infer U> ? U : never>> =>
  Codec.custom({
    decode: input => {
      for (const codec of codecs) {
        const res = codec.decode(input)
        if (res.isRight()) {
          return res
        }
      }

      return Left('fail')
    },
    encode: input => {
      for (const codec of codecs) {
        const res = codec.decode(input)
        if (res.isRight()) {
          return codec.encode(input)
        }
      }

      return input
    }
  })
