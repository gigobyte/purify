import { Either, Right, Left } from './Either'
import { identity } from './Function'
import { Maybe, Just, Nothing } from './Maybe'
import { NonEmptyList } from './NonEmptyList'
import { JSONSchema6 } from 'json-schema'

export interface Codec<T> {
  /** Takes a JSON value and runs the decode function the codec was constructed with. All of purify's built-in codecs return a descriptive error message in case the decode fails */
  decode: (input: unknown) => Either<string, T>
  /** Takes a runtime value and turns it into a JSON value using the encode function the codec was constructed with. Most of purify's built-in codecs have no custom encode method and they just return the same value, but you could add custom serialization logic for your custom codecs. */
  encode: <U = unknown>(input: T) => U
  /** The same as the decode method, but throws an exception on failure. Please only use as an escape hatch */
  unsafeDecode: (input: unknown) => T
  schema: () => JSONSchema6
}

/** Special type used when you want to do the opposite of `GetType` - define a Codec for an existing type. The problem is that due to technical limitations optional properties are hard to generate in TypeScript so Codec generates properties of type "T | undefined" instead, which is not compatible */
export type FromType<T> = {
  [P in keyof Required<T>]: Pick<T, P> extends Required<Pick<T, P>>
    ? T[P]
    : T[P] | undefined
}

/** You can use this to get a free type from any codec */
export type GetType<T extends Codec<any>> = T extends Codec<infer U> ? U : never

const isEmptySchema = (schema: JSONSchema6): boolean =>
  Object.keys(schema).length === 0

const isObject = (obj: unknown): obj is Record<string, unknown> =>
  typeof obj === 'object' && obj !== null && !Array.isArray(obj)

const reportError = (expectedType: string, input: unknown): string => {
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

    case 'symbol':
      receivedString = 'a symbol'
      break

    case 'function':
      receivedString = 'a function'
      break

    case 'bigint':
      receivedString = `a bigint with value ${input.toString()}`
  }

  receivedString =
    receivedString || `a ${typeof input} with value ${JSON.stringify(input)}`

  return `Expected ${expectedType}, but received ${receivedString}`
}

const removeOneOfWithSingleElement = (schema: JSONSchema6): JSONSchema6 => {
  const schemaKeys = Object.keys(schema)

  if (
    schemaKeys.length === 1 &&
    schema.oneOf?.length === 1 &&
    typeof schema.oneOf[0] === 'object'
  ) {
    Object.assign(schema, schema.oneOf[0])
    delete schema.oneOf
  }

  return schema
}

const flattenNestedOneOf = (schema: JSONSchema6): JSONSchema6 => {
  if (Array.isArray(schema.oneOf)) {
    for (let i = 0; i < schema.oneOf.length; i++) {
      const e = schema.oneOf[i]
      if (typeof e === 'object' && e.oneOf) {
        schema.oneOf.splice(i, 1)
        schema.oneOf.push(...e.oneOf)
        return optimizeSchema(schema)
      }
    }
  }

  return schema
}

const optimizeSchema = (schema: JSONSchema6): JSONSchema6 => {
  flattenNestedOneOf(schema)
  removeOneOfWithSingleElement(schema)

  return schema
}

export const Codec = {
  /** Creates a codec for any JSON object */
  interface<T extends Record<string, Codec<any>>>(
    properties: T
  ): Codec<{
    [k in keyof T]: GetType<T[k]>
  }> {
    const keys = Object.keys(properties)

    const decode: Codec<any>['decode'] = (input: unknown) => {
      if (!isObject(input)) {
        return Left(reportError('an object', input))
      }

      const result = {} as { [k in keyof T]: GetType<T[k]> }

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

        const decodedProperty = properties[key]!.decode(input[key])

        if (decodedProperty.isLeft()) {
          return Left(
            `Problem with the value of property "${key}": ${decodedProperty.extract()}`
          )
        }

        const value = decodedProperty.extract()

        if (value !== undefined) {
          result[key as keyof T] = value
        }
      }

      return Right(result)
    }

    const encode = (input: any) => {
      const result = {} as any

      for (const key of keys) {
        result[key as keyof T] = properties[key]!.encode(input[key]) as any
      }

      return result
    }

    return {
      decode,
      encode,
      unsafeDecode: (input) => decode(input).mapLeft(Error).unsafeCoerce(),
      schema: () =>
        keys.reduce(
          (acc, key) => {
            const isOptional = (properties[key] as any)._isOptional

            if (!isOptional) {
              acc.required.push(key)
            }

            acc.properties[key] = optimizeSchema(properties[key]!.schema())

            return acc
          },
          {
            type: 'object',
            properties: {} as Record<string, JSONSchema6>,
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
      unsafeDecode: (input) => decode(input).mapLeft(Error).unsafeCoerce(),
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

/** A codec for null only */
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
  encode: identity
})

export const optional = <T>(codec: Codec<T>): Codec<T | undefined> =>
  ({
    ...oneOf([codec, undefinedType]),
    schema: codec.schema,
    _isOptional: true
  } as any)

/** A codec for a value T or null. Keep in mind if you use `nullable` inside `Codec.interface` the property will still be required */
export const nullable = <T>(codec: Codec<T>): Codec<T | null> =>
  oneOf([codec, nullType])

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

/** A codec for a TypeScript enum */
export const enumeration = <T extends Record<string, string | number>>(
  e: T
): Codec<T[keyof T]> => {
  const enumValues = Object.values(e)

  return Codec.custom({
    decode: (input) => {
      return oneOf([string, number])
        .decode(input)
        .chain((x) => {
          const enumIndex = enumValues.indexOf(x)

          return enumIndex !== -1
            ? Right(enumValues[enumIndex] as T[keyof T])
            : Left(reportError('an enum member', input))
        })
    },
    encode: identity,
    schema: () => ({ enum: enumValues })
  })
}

/** A codec combinator that receives a list of codecs and runs them one after another during decode and resolves to whichever returns Right or to Left if all fail */
export const oneOf = <T extends [Codec<any>, ...Codec<any>[]]>(
  codecs: T
): Codec<GetType<T extends Array<infer U> ? U : never>> =>
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
        const res = Either.encase(() => codec.encode(input))
          .mapLeft((_) => '')
          .chain(codec.decode)

        if (res.isRight()) {
          return codec.encode(input)
        }
      }

      return input
    },
    schema: () => ({ oneOf: codecs.map((x) => x.schema()) })
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
              `Problem with the value at index ${i}: ${decoded.extract()}`
            )
          }
        }

        return Right(result)
      }
    },
    encode: (input) => input.map(codec.encode),
    schema: () => ({
      type: 'array',
      items: codec.schema()
    })
  })

const numberString = Codec.custom<any>({
  decode: (input) =>
    string
      .decode(input)
      .chain((x) =>
        isFinite(+x) ? Right(x) : Left(reportError('a number', input))
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
              `Problem with the value of property "${key}": ${decodedValue.extract()}`
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

/** A codec that only succeeds decoding when the value is exactly what you've constructed the codec with */
export const exactly = <T extends (string | number | boolean)[]>(
  ...expectedValues: T
): Codec<T[number]> =>
  Codec.custom({
    decode: (input: any) =>
      expectedValues.includes(input)
        ? Right(input)
        : Left(
            reportError(
              expectedValues.map((x) => JSON.stringify(x)).join(', '),
              input
            )
          ),
    encode: identity,
    schema: () => ({
      oneOf: expectedValues.map((value) => ({
        type: typeof value,
        enum: [value]
      }))
    })
  })

/** A special codec used when dealing with recursive data structures, it allows a codec to be recursively defined by itself */
export const lazy = <T>(getCodec: () => Codec<T>): Codec<T> =>
  Codec.custom({
    decode: (input) => getCodec().decode(input),
    encode: (input) => getCodec().encode(input),
    schema: () => ({
      $comment: 'Lazy codecs are not supported when generating a JSON schema'
    })
  })

/** A codec for purify's Maybe type. Encode runs Maybe#toJSON, which effectively returns the value inside if it's a Just or undefined if it's Nothing */
export const maybe = <T>(codec: Codec<T>): Codec<Maybe<T>> => {
  const baseCodec = Codec.custom<Maybe<T>>({
    decode: (input) =>
      Maybe.fromNullable(input).caseOf({
        Just: (x) => codec.decode(x).map(Just),
        Nothing: () => Right(Nothing)
      }),
    encode: (input) => input.map(codec.encode).orDefault(undefined),
    schema: () =>
      isEmptySchema(codec.schema())
        ? {}
        : { oneOf: [codec.schema(), { type: 'null' }] }
  })
  return {
    ...baseCodec,
    _isOptional: true
  } as any
}

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
): Codec<{
  [i in keyof TS]: TS[i] extends Codec<infer U> ? U : never
}> =>
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
          const decoded = codecs[i]!.decode(input[i])

          if (decoded.isRight()) {
            result.push(decoded.extract())
          } else {
            return Left(
              `Problem with the value at index ${i}: ${decoded.extract()}`
            )
          }
        }

        return Right(result)
      }
    },
    encode: (input) => input.map((x: any, i: number) => codecs[i]!.encode(x)),
    schema: () => ({
      type: 'array',
      items: codecs.map((x) => x.schema()),
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

/** Creates an intersection between two codecs. If the provided codecs are not for an object, the second decode result will be returned */
export const intersect = <T, U>(t: Codec<T>, u: Codec<U>): Codec<T & U> =>
  Codec.custom({
    decode: (input) => {
      const et = t.decode(input)
      if (et.isLeft()) {
        return et
      }

      const eu = u.decode(input)

      if (eu.isLeft()) {
        return eu
      }

      const valuet = et.extract() as T
      const valueu = eu.extract() as U

      return isObject(valuet) && isObject(valueu)
        ? Right(Object.assign(valuet, valueu))
        : Right(valueu as T & U)
    },
    encode: (input) => {
      const valuet = t.encode(input)
      const valueu = u.encode(input)

      return isObject(valuet) && isObject(valueu)
        ? Object.assign(valuet, valueu)
        : valueu
    },
    schema: () => ({ allOf: [t, u].map((x) => x.schema()) })
  })

/** A codec for the built-in Map type */
export const map = <K, V>(
  keyCodec: Codec<K>,
  valueCodec: Codec<V>
): Codec<Map<K, V>> =>
  Codec.custom({
    decode: (input) =>
      array(tuple([keyCodec, valueCodec]))
        .decode(input)
        .map((pairs) => new Map(pairs)),
    encode: (input) =>
      Array.from(input.entries()).map(([k, v]) => [
        keyCodec.encode(k),
        valueCodec.encode(v)
      ]),
    schema: () => ({
      type: 'array',
      items: {
        type: 'array',
        items: [keyCodec.schema(), valueCodec.schema()],
        additionalItems: false,
        minItems: 2,
        maxItems: 2
      }
    })
  })

export type ExpectedType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'object'
  | 'array'
  | 'null'
  | 'undefined'
  | 'enum'

export type ReceivedType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'object'
  | 'array'
  | 'null'
  | 'undefined'
  | 'bigint'
  | 'symbol'
  | 'function'

export type DecodeError =
  | { type: 'property'; property: string; error: DecodeError }
  | { type: 'index'; index: number; error: DecodeError }
  | { type: 'oneOf'; errors: DecodeError[] }
  | {
      type: 'failure'
      expectedType?: ExpectedType
      receivedType: ReceivedType
      receivedValue?: unknown
    }
  | { type: 'custom'; message: string }

const oneofRegex = /^(One of the following problems occured:)\s/
const oneOfCounterRegex = /\(\d\)\s/
const oneOfSeparatorRegex = /\, (?=\()/g
const failureRegex = /^(Expected ).+(, but received )/
const failureReceivedSeparator = ' with value'
const missingPropertyMarker = 'Problem with property "'
const badPropertyMarker = 'Problem with the value of property "'
const badPropertyKeyMarker = 'Problem with key type of property "'
const dateFailureMarket = 'Problem with date string: '
const indexMarker = 'Problem with the value at index '

const expectedTypesMap: Record<string, ExpectedType> = {
  'an object': 'object',
  'a number': 'number',
  'a string': 'string',
  'an undefined': 'undefined',
  'a boolean': 'boolean',
  'an array': 'array',
  'a null': 'null',
  'an enum member': 'enum'
}

const receivedTypesMap: Record<string, ReceivedType> = {
  'a string': 'string',
  'a number': 'number',
  null: 'null',
  undefined: 'undefined',
  'a boolean': 'boolean',
  'an array': 'array',
  'an object': 'object',
  'a symbol': 'symbol',
  'a function': 'function',
  'a bigint': 'bigint'
}

const receivedTypesWithoutValue: ReceivedType[] = [
  'null',
  'undefined',
  'boolean',
  'symbol',
  'function',
  'bigint'
]

/** Turns a string error message produced by a built-in purify codec into a meta object */
export const parseError = (error: string): DecodeError => {
  const oneOfCheck = error.match(oneofRegex)

  // One of the following problems occured: (0) *, (1) *
  if (oneOfCheck) {
    const remainer = error.replace(oneOfCheck[0]!, '')

    return {
      type: 'oneOf',
      errors: remainer
        .split(oneOfSeparatorRegex)
        .map((x) => parseError(x.replace(x.match(oneOfCounterRegex)![0]!, '')))
    }
  }

  const failureCheck = error.match(failureRegex)

  // Expected an object, but received an array with value []
  if (failureCheck) {
    const receivedTypeRaw = error.split(failureCheck[2]!).pop()!
    const receivedType =
      receivedTypesMap[receivedTypeRaw.split(failureReceivedSeparator)[0]!]

    if (receivedType) {
      const expectedTypeRaw = error
        .replace(failureCheck[1]!, '')
        .split(failureCheck[2]!)[0]!

      return {
        type: 'failure',
        expectedType: expectedTypesMap[expectedTypeRaw],
        receivedType,
        receivedValue: receivedTypesWithoutValue.includes(receivedType)
          ? undefined
          : JSON.parse(receivedTypeRaw.split(failureReceivedSeparator).pop()!)
      }
    }
  }

  // Problem with property "a": it does not exist in received object {}
  if (error.startsWith(missingPropertyMarker)) {
    const property = error.replace(missingPropertyMarker, '').split('": ')[0]!

    return {
      type: 'property',
      property,
      error: {
        type: 'failure',
        receivedType: 'undefined'
      }
    }
  }

  // Problem with the value of property "a": *
  // Problem with key type of property "a": *
  if (
    error.startsWith(badPropertyMarker) ||
    error.startsWith(badPropertyKeyMarker)
  ) {
    const [property, ...restOfError] = error
      .replace(badPropertyMarker, '')
      .replace(badPropertyKeyMarker, '')
      .split(/": (.+)/)

    return {
      type: 'property',
      property: property!,
      error: parseError(restOfError.join(''))
    }
  }

  // Problem with date string: *
  if (error.startsWith(dateFailureMarket)) {
    return parseError(error.replace(dateFailureMarket, ''))
  }

  //  Problem with the value at index 0: *
  if (error.startsWith(indexMarker)) {
    const [index, ...restOfError] = error
      .replace(indexMarker, '')
      .split(/: (.+)/)

    return {
      type: 'index',
      index: Number(index),
      error: parseError(restOfError.join(''))
    }
  }

  return { type: 'custom', message: error }
}
