import { Either, Right, Left } from './Either'
import { identity } from './Function'
import { Maybe, Just, Nothing } from './Maybe'
import { NonEmptyList } from './NonEmptyList'

export interface Codec<T> {
  decode: (input: unknown) => Either<string, T>
  encode: (input: T) => T
  unsafeDecode: (input: unknown) => T
}

export type GetInterface<T extends Codec<any>> = T extends Codec<infer U>
  ? U
  : never

const isObject = (obj: unknown): obj is object =>
  typeof obj === 'object' && obj !== null && !Array.isArray(obj)

export const Codec = {
  interface<T extends Record<string, Codec<any>>>(
    properties: T
  ): Codec<
    {
      [k in keyof T]: GetInterface<T[k]>
    }
  > {
    const decode = (input: any) => {
      if (!isObject(input)) {
        return Left('fail')
      }

      const result = {} as { [k in keyof T]: GetInterface<T[k]> }
      const keys = Object.keys(properties)

      for (const key of keys) {
        const decodedProperty = properties[key].decode((input as any)[key])

        if (decodedProperty.isLeft()) {
          return Left('fail')
        }

        result[key as keyof T] = decodedProperty.extract()
      }

      return Right(result)
    }

    const encode = (input: any) => {
      const result = {} as { [k in keyof T]: GetInterface<T[k]> }
      const keys = Object.keys(properties)

      for (const key of keys) {
        result[key as keyof T] = properties[key].encode(input[key])
      }

      return result
    }

    return {
      decode,
      encode,
      unsafeDecode: input => decode(input).unsafeCoerce()
    }
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
      encode,
      unsafeDecode: input => decode(input).unsafeCoerce()
    }
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

export const boolean = Codec.custom<boolean>({
  decode: input => (typeof input === 'boolean' ? Right(input) : Left('fail')),
  encode: identity
})

export const unknown = Codec.custom<unknown>({
  decode: Right,
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

export const array = <T>(codec: Codec<T>): Codec<Array<T>> =>
  Codec.custom({
    decode: input => {
      if (!Array.isArray(input)) {
        return Left('fail')
      } else {
        const result: T[] = []

        for (const e of input) {
          const decoded = codec.decode(e)

          if (decoded.isRight()) {
            result.push(decoded.extract())
          } else {
            return Left('fail')
          }
        }

        return Right(result)
      }
    },
    encode: input => input.map(codec.encode)
  })

const numberString = Codec.custom<any>({
  decode: input =>
    string.decode(input).chain(x => (isFinite(+x) ? Right(x) : Left('fail'))),
  encode: identity
})

export const record = <K extends keyof any, V>(
  keyCodec: Codec<K>,
  valueCodec: Codec<V>
): Codec<Record<K, V>> =>
  Codec.custom({
    decode: input => {
      const result = {} as Record<K, V>
      const keyCodecOverride: Codec<K> =
        (keyCodec as any) === number ? numberString : keyCodec

      if (!isObject(input)) {
        return Left('fail')
      }

      for (const key of Object.keys(input)) {
        if (input.hasOwnProperty(key)) {
          const decodedKey = keyCodecOverride.decode(key)
          const decodedValue = valueCodec.decode((input as any)[key])

          if (decodedKey.isRight() && decodedValue.isRight()) {
            result[decodedKey.extract()] = decodedValue.extract()
          } else {
            return Left('fail')
          }
        }
      }

      return Right(result)
    },
    encode: input => {
      const result = {} as Record<K, V>

      for (const key in input) {
        if (input.hasOwnProperty(key)) {
          result[keyCodec.encode(key)] = valueCodec.encode(input[key])
        }
      }

      return result
    }
  })

export const exactly = <T extends string | number | boolean>(
  expectedValue: T
): Codec<T> =>
  Codec.custom({
    decode: input =>
      input === expectedValue ? Right(expectedValue) : Left('fail'),
    encode: identity
  })

export const lazy = <T>(getCodec: () => Codec<T>): Codec<T> =>
  Codec.custom({
    decode: input => getCodec().decode(input),
    encode: input => getCodec().encode(input)
  })

export const maybe = <T>(codec: Codec<T>): Codec<Maybe<T>> =>
  Codec.custom({
    decode: input =>
      Maybe.fromNullable(input).caseOf({
        Just: x => codec.decode(x).map(Just),
        Nothing: () => Right(Nothing)
      }),
    encode: input => input.toJSON()
  })

export const nonEmptyList = <T>(codec: Codec<T>): Codec<NonEmptyList<T>> => {
  const arrayCodec = array(codec)
  return Codec.custom({
    decode: input =>
      arrayCodec
        .decode(input)
        .chain(x => NonEmptyList.fromArray(x).toEither('fail')),
    encode: arrayCodec.encode
  })
}

export const tuple = <TS extends [Codec<any>, ...Codec<any>[]]>(
  codecs: TS
): Codec<
  {
    [i in keyof TS]: TS[i] extends Codec<infer U> ? U : never
  }
> =>
  Codec.custom({
    decode: input => {
      if (!Array.isArray(input) || codecs.length !== input.length) {
        return Left('fail')
      } else {
        const result: any = []

        for (let i = 0; i < codecs.length; i++) {
          const decoded = codecs[i].decode(input[i])

          if (decoded.isRight()) {
            result.push(decoded.extract())
          } else {
            return Left('fail')
          }
        }

        return Right(result)
      }
    },
    encode: input => input.map((x, i) => codecs[i].encode(x))
  })
