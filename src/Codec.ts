import { Either, Right, Left } from './Either'
import { identity } from './Function'
import { Maybe, Just, Nothing } from './Maybe'
import { NonEmptyList } from './NonEmptyList'

export interface Codec<T> {
  /** Takes a JSON value and runs the decode function the codec was constructed with. All of purify's built-in codecs return a descriptive error message in case the decode fails */
  decode: (input: unknown) => Either<string, T>
  /** Takes a runtime value and turns it into a JSON value using the encode function the codec was constructed with. Most of purify's built-in codecs have no custom encode method and they just return the same value, but you could add custom serialization logic for your custom codecs. */
  encode: (input: T) => unknown
  /** The same as the decode method, but throws an exception on failure. Please only use as an escape hatch */
  unsafeDecode: (input: unknown) => T
  schema: () => object
}

/** You can use this to get a free type from an interface codec */
export type GetInterface<T extends Codec<any>> = T extends Codec<infer U>
  ? U
  : never

const isObject = (obj: unknown): obj is object =>
  typeof obj === 'object' && obj !== null && !Array.isArray(obj)

const reportError = (type: string, input: unknown): string => {
  let receivedString: string = ''

  switch (typeof input) {
    case 'undefined':
      receivedString = 'undefined'
      break

    case 'object':
      receivedString =
        input === null
          ? 'null'
          : Array.isArray(input)
          ? 'an array with value ' + JSON.stringify(input)
          : 'an object with value ' + JSON.stringify(input)
      break

    case 'boolean':
      receivedString = 'a boolean'
      break
  }

  receivedString =
    receivedString || `a ${typeof input} with value ${JSON.stringify(input)}`

  return `Expected ${type}, but received ${receivedString}`
}

export const Codec = {
  /** Creates a codec for any JSON object */
  interface<T extends Record<string, Codec<any>>>(
    properties: T
  ): Codec<
    {
      [k in keyof T]: GetInterface<T[k]>
    }
  > {
    const keys = Object.keys(properties)

    const decode = (input: any) => {
      if (!isObject(input)) {
        return Left(reportError('an object', input))
      }

      const result = {} as { [k in keyof T]: GetInterface<T[k]> }

      for (const key of keys) {
        if (
          !input.hasOwnProperty(key) &&
          !(properties[key] as any)._isOptional
        ) {
          return Left(
            `Problem with property "${key}": it does not exist in received object ${JSON.stringify(
              input
            )}`
          )
        }

        const decodedProperty = properties[key].decode((input as any)[key])

        if (decodedProperty.isLeft()) {
          return Left(
            `Problem with the value of property "${key}": ${decodedProperty.extract()}`
          )
        }

        result[key as keyof T] = decodedProperty.extract()
      }

      return Right(result)
    }

    const encode = (input: any) => {
      const result = {} as { [k in keyof T]: GetInterface<T[k]> }

      for (const key of keys) {
        result[key as keyof T] = properties[key].encode(input[key]) as any
      }

      return result
    }

    return {
      decode,
      encode,
      unsafeDecode: (input) => decode(input).unsafeCoerce(),
      schema: () =>
        keys.reduce(
          (acc, key) => {
            if (!(properties[key] as any)._isOptional) {
              acc.required.push(key)
            }

            acc.properties[key] = properties[key].schema()

            return acc
          },
          {
            type: 'object',
            properties: {} as Record<string, unknown>,
            required: [] as string[]
          }
        )
    }
  },

  /** Creates a codec for any type, you can add your own deserialization/validation logic in the decode argument */
  custom<T>({
    decode,
    encode,
    schema
  }: {
    decode: (value: unknown) => Either<string, T>
    encode: (value: T) => any
    schema?: () => object
  }): Codec<T> {
    return {
      decode,
      encode,
      unsafeDecode: (input) => decode(input).unsafeCoerce(),
      schema: schema ?? (() => ({}))
    }
  }
}

/** A codec for any string value. Most of the time you will use it to implement an interface codec (see the Codec#interface example above). Encoding a string acts like the identity function */
export const string = Codec.custom<string>({
  decode: (input) =>
    typeof input === 'string'
      ? Right(input)
      : Left(reportError('a string', input)),
  encode: identity,
  schema: () => ({ type: 'string' })
})

/** A codec for any number value. This includes anything that has a typeof number - NaN, Infinity etc. Encoding a number acts like the identity function */
export const number = Codec.custom<number>({
  decode: (input) =>
    typeof input === 'number'
      ? Right(input)
      : Left(reportError('a number', input)),
  encode: identity,
  schema: () => ({ type: 'number' })
})

/** A codec for null only. Most of the time you will use it with the oneOf codec combinator to create a codec for a type like "string | null" */
export const nullType = Codec.custom<null>({
  decode: (input) =>
    input === null ? Right(input) : Left(reportError('a null', input)),
  encode: identity,
  schema: () => ({ type: 'null' })
})

const undefinedType = Codec.custom<undefined>({
  decode: (input) =>
    input === undefined
      ? Right(input)
      : Left(reportError('an undefined', input)),
  encode: identity,
  schema: () => ({})
})

export const optional = <T>(codec: Codec<T>): Codec<T | undefined> =>
  ({
    ...oneOf([codec, undefinedType]),
    _isOptional: true
  } as any)

/** A codec for a boolean value */
export const boolean = Codec.custom<boolean>({
  decode: (input) =>
    typeof input === 'boolean'
      ? Right(input)
      : Left(reportError('a boolean', input)),
  encode: identity,
  schema: () => ({ type: 'boolean' })
})

/** A codec that can never fail, but of course you get no type information. Encoding an unknown acts like the identity function */
export const unknown = Codec.custom<unknown>({
  decode: Right,
  encode: identity,
  schema: () => ({})
})

/** A codec combinator that receives a list of codecs and runs them one after another during decode and resolves to whichever returns Right or to Left if all fail. This module does not expose a "nullable" or "optional" codec combinators because it\'s trivial to implement/replace them using oneOf */
export const oneOf = <T extends Array<Codec<any>>>(
  codecs: T
): Codec<GetInterface<T extends Array<infer U> ? U : never>> =>
  Codec.custom({
    decode: (input) => {
      let errors: string[] = []

      for (const codec of codecs) {
        const res = codec.decode(input)
        if (res.isRight()) {
          return res
        } else {
          errors.push(res.extract())
        }
      }

      return Left(
        `One of the following problems occured: ${errors
          .map((err, i) => `(${i}) ${err}`)
          .join(', ')}`
      )
    },
    encode: (input) => {
      for (const codec of codecs) {
        const res = codec.decode(input)
        if (res.isRight()) {
          return codec.encode(input)
        }
      }

      return input
    },
    schema: () => ({ oneOf: codecs.map((x) => x.schema()).filter(Boolean) })
  })

/** A codec for an array */
export const array = <T>(codec: Codec<T>): Codec<Array<T>> =>
  Codec.custom({
    decode: (input) => {
      if (!Array.isArray(input)) {
        return Left(reportError('an array', input))
      } else {
        const result: T[] = []

        for (let i = 0; i < input.length; i++) {
          const decoded = codec.decode(input[i])

          if (decoded.isRight()) {
            result.push(decoded.extract())
          } else {
            return Left(
              `Problem with value at index ${i}: ${decoded.extract()}`
            )
          }
        }

        return Right(result)
      }
    },
    encode: (input) => input.map(codec.encode),
    schema: () => ({
      type: 'array',
      items: codec.schema() ? [codec.schema()] : []
    })
  })

const numberString = Codec.custom<any>({
  decode: (input) =>
    string
      .decode(input)
      .chain((x) =>
        isFinite(+x) ? Right(x) : Left(reportError('a number key', input))
      ),
  encode: identity,
  schema: number.schema
})

/** A codec for an object without specific properties, its restrictions are equivalent to the Record<K, V> type so you can only check for number and string keys */
export const record = <K extends keyof any, V>(
  keyCodec: Codec<K>,
  valueCodec: Codec<V>
): Codec<Record<K, V>> =>
  Codec.custom({
    decode: (input) => {
      const result = {} as Record<K, V>
      const keyCodecOverride: Codec<K> =
        (keyCodec as any) === number ? numberString : keyCodec

      if (!isObject(input)) {
        return Left(reportError('an object', input))
      }

      for (const key of Object.keys(input)) {
        if (input.hasOwnProperty(key)) {
          const decodedKey = keyCodecOverride.decode(key)
          const decodedValue = valueCodec.decode((input as any)[key])

          if (decodedKey.isRight() && decodedValue.isRight()) {
            result[decodedKey.extract()] = decodedValue.extract()
          } else if (decodedKey.isLeft()) {
            return Left(
              `Problem with key type of property "${key}": ${decodedKey.extract()}`
            )
          } else if (decodedValue.isLeft()) {
            return Left(
              `Problem with value of property "${key}": ${decodedValue.extract()}`
            )
          }
        }
      }

      return Right(result)
    },
    encode: (input) => {
      const result = {} as Record<K, V>

      for (const key in input) {
        if (input.hasOwnProperty(key)) {
          result[keyCodec.encode(key) as K] = valueCodec.encode(input[key]) as V
        }
      }

      return result
    },
    schema: () => ({
      type: 'object',
      additionalProperties: valueCodec.schema()
    })
  })

/** A codec that only succeeds decoding when the value is exactly what you've constructed the codec with. It's useful when you're decoding an enum, for example */
export const exactly = <T extends string | number | boolean>(
  expectedValue: T
): Codec<T> =>
  Codec.custom({
    decode: (input) =>
      input === expectedValue
        ? Right(expectedValue)
        : Left(
            typeof input === typeof expectedValue
              ? `Expected a ${typeof input} with a value of exactly ${JSON.stringify(
                  expectedValue
                )}, the types match, but the received value is ${JSON.stringify(
                  input
                )}`
              : reportError(
                  `a ${typeof expectedValue} with a value of exactly ${expectedValue}`,
                  input
                )
          ),
    encode: identity,
    schema: () => ({ type: typeof expectedValue, enum: [expectedValue] })
  })

/** A special codec used when dealing with recursive data structures, it allows a codec to be recursively defined by itself */
export const lazy = <T>(getCodec: () => Codec<T>): Codec<T> =>
  Codec.custom({
    decode: (input) => getCodec().decode(input),
    encode: (input) => getCodec().encode(input)
  })

/** A codec for purify's Maybe type. Encode runs Maybe#toJSON, which effectively returns the value inside if it's a Just or undefined if it's Nothing */
export const maybe = <T>(codec: Codec<T>): Codec<Maybe<T>> =>
  Codec.custom({
    decode: (input: unknown) =>
      Maybe.fromNullable(input).caseOf({
        Just: (x) => codec.decode(x).map(Just),
        Nothing: () => Right(Nothing)
      }),
    encode: (input: Maybe<T>) => input.toJSON(),
    schema: () => ({
      oneOf: codec.schema() ? [codec.schema(), { type: 'null' }] : []
    }),
    _isOptional: true
  } as any)

/** A codec for purify's NEL type */
export const nonEmptyList = <T>(codec: Codec<T>): Codec<NonEmptyList<T>> => {
  const arrayCodec = array(codec)
  return Codec.custom({
    decode: (input) =>
      arrayCodec
        .decode(input)
        .chain((x) =>
          NonEmptyList.fromArray(x).toEither(
            `Expected an array with one or more elements, but received an empty array`
          )
        ),
    encode: arrayCodec.encode,
    schema: () => ({ ...arrayCodec.schema(), minItems: 1 })
  })
}

/** The same as the array decoder, but accepts a fixed amount of array elements and you can specify each element type, much like the tuple type */
export const tuple = <TS extends [Codec<any>, ...Codec<any>[]]>(
  codecs: TS
): Codec<
  {
    [i in keyof TS]: TS[i] extends Codec<infer U> ? U : never
  }
> =>
  Codec.custom({
    decode: (input) => {
      if (!Array.isArray(input)) {
        return Left(reportError('an array', input))
      } else if (codecs.length !== input.length) {
        return Left(
          `Expected an array of length ${codecs.length}, but received an array with length of ${input.length}`
        )
      } else {
        const result: any = []

        for (let i = 0; i < codecs.length; i++) {
          const decoded = codecs[i].decode(input[i])

          if (decoded.isRight()) {
            result.push(decoded.extract())
          } else {
            return Left(
              `Problem with value at index ${i}: ${decoded.extract()}`
            )
          }
        }

        return Right(result)
      }
    },
    encode: (input) => input.map((x, i) => codecs[i].encode(x)),
    schema: () => ({
      type: 'array',
      items: codecs.map((x) => x.schema()).filter(Boolean),
      additionalItems: false,
      minItems: codecs.length,
      maxItems: codecs.length
    })
  })

/** A codec for a parsable date string, on successful decoding it resolves to a Date object. The validity of the date string during decoding is decided by the browser implementation of Date.parse. Encode runs toISOString on the passed in date object */
export const date = Codec.custom<Date>({
  decode: (input) =>
    string
      .decode(input)
      .mapLeft((err) => `Problem with date string: ${err}`)
      .chain((x) =>
        Number.isNaN(Date.parse(x))
          ? Left(
              'Expected a valid date string, but received a string that cannot be parsed'
            )
          : Right(new Date(x))
      ),
  encode: (input) => input.toISOString(),
  schema: () => ({ type: 'string', format: 'date-time' })
})

console.dir(
  Codec.interface({
    username: string,
    age: number,
    coordinates: array(oneOf([string, number])),
    gender: optional(string)
  }).schema(),
  { depth: null }
)
