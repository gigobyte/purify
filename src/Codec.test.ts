import {
  Codec,
  number,
  string,
  oneOf,
  nullType,
  boolean,
  unknown,
  array,
  record,
  exactly,
  maybe,
  nonEmptyList,
  tuple,
  lazy,
  date,
  optional,
  nullable,
  enumeration
} from './Codec'
import { Left, Right } from './Either'
import { Just, Nothing } from './Maybe'
import { NonEmptyList } from './NonEmptyList'

describe('Codec', () => {
  describe('interface', () => {
    const mockCodec = Codec.interface({
      a: number,
      b: string,
      c: optional(string)
    })

    test('decode', () => {
      expect(mockCodec.decode(0)).toEqual(
        Left('Expected an object, but received a number with value 0')
      )
      expect(mockCodec.decode({})).toEqual(
        Left(
          'Problem with property "a": it does not exist in received object {}'
        )
      )
      expect(mockCodec.decode({ a: 0 })).toEqual(
        Left(
          'Problem with property "b": it does not exist in received object {"a":0}'
        )
      )
      expect(mockCodec.decode({ b: '' })).toEqual(
        Left(
          'Problem with property "a": it does not exist in received object {"b":""}'
        )
      )
      expect(mockCodec.decode({ a: '', b: '' })).toEqual(
        Left(
          'Problem with the value of property "a": Expected a number, but received a string with value ""'
        )
      )

      expect(mockCodec.decode({ a: 0, b: '' })).toEqual(Right({ a: 0, b: '' }))
      expect(mockCodec.decode({ a: 0, b: '', c: '' })).toEqual(
        Right({ a: 0, b: '', c: '' })
      )
    })

    test('unsafeDecode', () => {
      expect(() => mockCodec.unsafeDecode({})).toThrowError(
        new Error('Either got coerced to a Left')
      )
      expect(() => mockCodec.unsafeDecode({ a: 0, b: '' })).not.toThrow()
    })

    test('encode', () => {
      expect(mockCodec.encode({ a: 0, b: '', c: undefined })).toEqual({
        a: 0,
        b: '',
        c: undefined
      })
      expect(mockCodec.encode({ a: 0, b: '', d: '' } as any)).toEqual({
        a: 0,
        b: ''
      })
      expect(mockCodec.encode({} as any)).toEqual({})
    })
  })

  describe('string', () => {
    test('decode', () => {
      expect(string.decode(0)).toEqual(
        Left('Expected a string, but received a number with value 0')
      )
      expect(string.decode({})).toEqual(
        Left('Expected a string, but received an object with value {}')
      )
      expect(string.decode(undefined)).toEqual(
        Left('Expected a string, but received undefined')
      )
      expect(string.decode(null)).toEqual(
        Left('Expected a string, but received null')
      )
      expect(string.decode(false)).toEqual(
        Left('Expected a string, but received a boolean')
      )

      expect(string.decode('')).toEqual(Right(''))
    })

    test('encode', () => {
      expect(string.encode('')).toEqual('')
    })
  })

  describe('number', () => {
    test('decode', () => {
      expect(number.decode('4')).toEqual(
        Left('Expected a number, but received a string with value "4"')
      )
      expect(number.decode(null)).toEqual(
        Left('Expected a number, but received null')
      )

      expect(number.decode(NaN)).toEqual(Right(NaN))
      expect(number.decode(0)).toEqual(Right(0))
    })

    test('encode', () => {
      expect(number.encode(0)).toEqual(0)
    })
  })

  describe('null', () => {
    test('decode', () => {
      expect(nullType.decode(undefined)).toEqual(
        Left('Expected a null, but received undefined')
      )
      expect(nullType.decode({})).toEqual(
        Left('Expected a null, but received an object with value {}')
      )

      expect(nullType.decode(null)).toEqual(Right(null))
    })

    test('encode', () => {
      expect(nullType.encode(null)).toEqual(null)
    })
  })

  describe('optional', () => {
    test('decode', () => {
      expect(optional(number).decode(null)).toEqual(
        Left(
          'One of the following problems occured: (0) Expected a number, but received null, (1) Expected an undefined, but received null'
        )
      )
      expect(optional(number).decode(false)).toEqual(
        Left(
          'One of the following problems occured: (0) Expected a number, but received a boolean, (1) Expected an undefined, but received a boolean'
        )
      )

      expect(optional(number).decode(undefined)).toEqual(Right(undefined))
    })

    test('encode', () => {
      expect(optional(number).encode(undefined)).toEqual(undefined)
    })
  })

  describe('boolean', () => {
    test('decode', () => {
      expect(boolean.decode('')).toEqual(
        Left('Expected a boolean, but received a string with value ""')
      )
      expect(boolean.decode(0)).toEqual(
        Left('Expected a boolean, but received a number with value 0')
      )
      expect(boolean.decode(undefined)).toEqual(
        Left('Expected a boolean, but received undefined')
      )

      expect(boolean.decode(true)).toEqual(Right(true))
    })

    test('encode', () => {
      expect(boolean.encode(true)).toEqual(true)
    })
  })

  describe('unknown', () => {
    const inputs = ['', {}, null, 0, undefined, false]

    test('decode', () => {
      inputs.forEach((input) => {
        expect(unknown.decode(input)).toEqual(Right(input))
      })
    })

    test('encode', () => {
      inputs.forEach((input) => {
        expect(unknown.encode(input)).toEqual(input)
      })
    })
  })

  describe('array', () => {
    test('decode', () => {
      const numberArray = array(number)

      expect(numberArray.decode('')).toEqual(
        Left('Expected an array, but received a string with value ""')
      )
      expect(numberArray.decode([''])).toEqual(
        Left(
          'Problem with value at index 0: Expected a number, but received a string with value ""'
        )
      )
      expect(numberArray.decode([0, ''])).toEqual(
        Left(
          'Problem with value at index 1: Expected a number, but received a string with value ""'
        )
      )

      expect(numberArray.decode([])).toEqual(Right([]))
      expect(numberArray.decode([0])).toEqual(Right([0]))
    })

    test('encode', () => {
      const mockCodec = Codec.custom<number>({
        decode: number.decode,
        encode: (input: number) => input + 1
      })

      expect(array(unknown).encode([])).toEqual([])
      expect(array(mockCodec).encode([1, 2, 3])).toEqual([2, 3, 4])
    })
  })

  describe('record', () => {
    test('decode', () => {
      const numberRecord = record(string, number)

      expect(numberRecord.decode([])).toEqual(
        Left('Expected an object, but received an array with value []')
      )
      expect(numberRecord.decode(null)).toEqual(
        Left('Expected an object, but received null')
      )
      expect(numberRecord.decode({ a: true })).toEqual(
        Left(
          'Problem with value of property "a": Expected a number, but received a boolean'
        )
      )

      expect(numberRecord.decode({})).toEqual(Right({}))
      expect(numberRecord.decode({ a: 0 })).toEqual(Right({ a: 0 }))
      expect(numberRecord.decode({ a: 0, b: 1 })).toEqual(Right({ a: 0, b: 1 }))
    })

    test('decode with number key', () => {
      const numberRecord = record(number, number)

      expect(numberRecord.decode({ a: 0 })).toEqual(
        Left(
          'Problem with key type of property "a": Expected a number key, but received a string with value "a"'
        )
      )
      expect(numberRecord.decode({ 0: 0 })).toEqual(Right({ 0: 0 }))
    })

    test('encode', () => {
      const mockKeyCodec = Codec.custom<string>({
        decode: string.decode,
        encode: (_) => 'haha'
      })

      const mockValueCodec = Codec.custom<number>({
        decode: number.decode,
        encode: (input: number) => input + 1
      })

      expect(record(string, string).encode({})).toEqual({})
      expect(record(mockKeyCodec, mockValueCodec).encode({ a: 0 })).toEqual({
        haha: 1
      })
    })
  })

  describe('oneOf', () => {
    const mockCodec = oneOf([string, boolean])

    test('decode', () => {
      expect(mockCodec.decode(0)).toEqual(
        Left(
          'One of the following problems occured: (0) Expected a string, but received a number with value 0, (1) Expected a boolean, but received a number with value 0'
        )
      )
      expect(mockCodec.decode([])).toEqual(
        Left(
          'One of the following problems occured: (0) Expected a string, but received an array with value [], (1) Expected a boolean, but received an array with value []'
        )
      )

      expect(mockCodec.decode('')).toEqual(Right(''))
      expect(mockCodec.decode(false)).toEqual(Right(false))
    })

    test('encode', () => {
      expect(mockCodec.encode('')).toEqual('')
      expect(mockCodec.encode(false)).toEqual(false)

      const fancyStringCodec = Codec.custom<string>({
        decode: string.decode,
        encode: (_) => 'always!'
      })

      const fancyNumberCodec = Codec.custom<number>({
        decode: number.decode,
        encode: (input) => input + 1
      })

      const fancyMockCodec = oneOf([fancyStringCodec, fancyNumberCodec])

      expect(fancyMockCodec.encode('')).toEqual('always!')
      expect(fancyMockCodec.encode(1)).toEqual(2)
      expect(fancyMockCodec.encode(true as any)).toEqual(true)
    })
  })

  describe('exactly', () => {
    test('decode', () => {
      expect(exactly(0).decode(10)).toEqual(
        Left(
          'Expected a number with a value of exactly 0, the types match, but the received value is 10'
        )
      )
      expect(exactly(0).decode('')).toEqual(
        Left(
          'Expected a number with a value of exactly 0, but received a string with value ""'
        )
      )

      expect(exactly(0).decode(0)).toEqual(Right(0))

      expect(exactly('a').decode('b')).toEqual(
        Left(
          'Expected a string with a value of exactly "a", the types match, but the received value is "b"'
        )
      )
      expect(exactly('a').decode('')).toEqual(
        Left(
          'Expected a string with a value of exactly "a", the types match, but the received value is ""'
        )
      )

      expect(exactly('a').decode('a')).toEqual(Right('a'))

      expect(exactly(true).decode(false)).toEqual(
        Left(
          'Expected a boolean with a value of exactly true, the types match, but the received value is false'
        )
      )
      expect(exactly(true).decode('')).toEqual(
        Left(
          'Expected a boolean with a value of exactly true, but received a string with value ""'
        )
      )

      expect(exactly(true).decode(true)).toEqual(Right(true))
    })

    test('encode', () => {
      expect(exactly(0).encode(0)).toEqual(0)
      expect(exactly('a').encode('a')).toEqual('a')
      expect(exactly(true).encode(true)).toEqual(true)
    })
  })

  describe('maybe', () => {
    test('decode', () => {
      const maybeNumber = maybe(number)

      expect(maybeNumber.decode('4')).toEqual(
        Left('Expected a number, but received a string with value "4"')
      )
      expect(maybeNumber.decode({})).toEqual(
        Left('Expected a number, but received an object with value {}')
      )

      expect(maybeNumber.decode(0)).toEqual(Right(Just(0)))
      expect(maybeNumber.decode(null)).toEqual(Right(Nothing))
      expect(maybeNumber.decode(undefined)).toEqual(Right(Nothing))
    })

    test('encode', () => {
      const maybeNumber = maybe(number)

      expect(maybeNumber.encode(Nothing)).toEqual(undefined)
      expect(maybeNumber.encode(Just(0))).toEqual(0)
    })
  })

  describe('nonEmptyList', () => {
    test('decode', () => {
      const numberNEL = nonEmptyList(number)

      expect(numberNEL.decode([])).toEqual(
        Left(
          'Expected an array with one or more elements, but received an empty array'
        )
      )
      expect(numberNEL.decode([''])).toEqual(
        Left(
          'Problem with value at index 0: Expected a number, but received a string with value ""'
        )
      )
      expect(numberNEL.decode(null)).toEqual(
        Left('Expected an array, but received null')
      )

      expect(numberNEL.decode([0])).toEqual(Right(NonEmptyList([0])))
    })

    test('encode', () => {
      const mockCodec = Codec.custom<number>({
        decode: number.decode,
        encode: (input: number) => input + 1
      })

      expect(nonEmptyList(mockCodec).encode(NonEmptyList([1, 2, 3]))).toEqual([
        2,
        3,
        4
      ])
    })
  })

  describe('tuple', () => {
    test('decode', () => {
      expect(tuple([number]).decode('')).toEqual(
        Left('Expected an array, but received a string with value ""')
      )
      expect(tuple([number]).decode([])).toEqual(
        Left(
          'Expected an array of length 1, but received an array with length of 0'
        )
      )
      expect(tuple([number]).decode([''])).toEqual(
        Left(
          'Problem with value at index 0: Expected a number, but received a string with value ""'
        )
      )
      expect(tuple([number]).decode([0, 1])).toEqual(
        Left(
          'Expected an array of length 1, but received an array with length of 2'
        )
      )

      expect(tuple([number]).decode([0])).toEqual(Right([0]))
    })

    test('encode', () => {
      const mockCodec = Codec.custom<number>({
        decode: number.decode,
        encode: (input: number) => input + 1
      })

      const mockCodec2 = Codec.custom<number>({
        decode: number.decode,
        encode: (input: number) => input + 2
      })

      expect(tuple([mockCodec, mockCodec2]).encode([0, 0])).toEqual([1, 2])
    })
  })

  describe('lazy', () => {
    interface TestInterface {
      a: TestInterface | string
    }

    const recursiveCodec: Codec<TestInterface> = Codec.interface({
      a: lazy(() => oneOf([recursiveCodec, string]))
    })

    test('decode', () => {
      expect(recursiveCodec.decode({})).toEqual(
        Left(
          'Problem with property "a": it does not exist in received object {}'
        )
      )

      expect(recursiveCodec.decode({ a: { a: { a: '' } } })).toEqual(
        Right({ a: { a: { a: '' } } })
      )
    })

    test('encode', () => {
      expect(recursiveCodec.encode({ a: '' })).toEqual({ a: '' })
    })
  })

  describe('date', () => {
    const now = new Date()
    const nowISOString = now.toISOString()

    test('decode', () => {
      expect(date.decode(null)).toEqual(
        Left('Problem with date string: Expected a string, but received null')
      )
      expect(date.decode('')).toEqual(
        Left(
          'Expected a valid date string, but received a string that cannot be parsed'
        )
      )

      expect(date.decode(nowISOString)).toEqual(Right(now))
    })

    test('encode', () => {
      expect(date.encode(now)).toEqual(nowISOString)
    })
  })

  describe('nullable', () => {
    test('decode', () => {
      expect(nullable(string).decode('')).toEqual(Right(''))
      expect(nullable(string).decode(null)).toEqual(Right(null))
      expect(nullable(string).decode(0)).toEqual(
        Left(
          'One of the following problems occured: (0) Expected a string, but received a number with value 0, (1) Expected a null, but received a number with value 0'
        )
      )
    })

    test('encode', () => {
      expect(nullable(string).encode('')).toEqual('')
      expect(nullable(string).encode(null)).toEqual(null)
    })
  })

  describe('enumeration', () => {
    enum Test {
      Test1 = 'Test1',
      Test2 = 'Test2'
    }

    enum NumTest {
      NumTest1,
      NumTest2
    }

    test('decode', () => {
      expect(enumeration(Test).decode('Test1')).toEqual(Right(Test.Test1))
      expect(enumeration(NumTest).decode(0)).toEqual(Right(NumTest.NumTest1))

      expect(enumeration(Test).decode(0)).toEqual(
        Left('Expected an enum member, but received a number with value 0')
      )
      expect(enumeration(Test).decode(null)).toEqual(
        Left('Expected a string or number, but received null')
      )
    })

    test('encode', () => {
      expect(enumeration(Test).encode(Test.Test1)).toEqual('Test1')
      expect(enumeration(NumTest).encode(NumTest.NumTest1)).toEqual(0)
    })
  })

  describe('JSON schema', () => {
    enum E {
      E1 = 'E1',
      E2 = 'E2'
    }

    const God = Codec.interface({
      a: string,
      b: Codec.interface({
        c: number,
        d: nullType,
        e: nullable(string),
        f: optional(boolean)
      }),
      u: unknown,
      en: enumeration(E),
      on: oneOf([array(string), record(string, string)]),
      optimal: oneOf([oneOf([oneOf([optional(optional(string))])])]),
      e: exactly('SSS'),
      m: maybe(tuple([number, number])),
      n: nonEmptyList(date)
    })

    expect(God.schema()).toEqual({
      type: 'object',
      properties: {
        a: { type: 'string' },
        b: {
          type: 'object',
          properties: {
            c: { type: 'number' },
            d: { type: 'null' },
            e: { oneOf: [{ type: 'string' }, { type: 'null' }] },
            f: { type: 'boolean' }
          },
          required: ['c', 'd', 'e']
        },
        u: {},
        en: { enum: ['E1', 'E2'] },
        on: {
          oneOf: [
            { type: 'array', items: [{ type: 'string' }] },
            { type: 'object', additionalProperties: { type: 'string' } }
          ]
        },
        optimal: { type: 'string' },
        e: { type: 'string', enum: ['SSS'] },
        m: {
          oneOf: [
            {
              type: 'array',
              items: [{ type: 'number' }, { type: 'number' }],
              additionalItems: false,
              minItems: 2,
              maxItems: 2
            },
            { type: 'null' }
          ]
        },
        n: {
          type: 'array',
          items: [{ type: 'string', format: 'date-time' }],
          minItems: 1
        }
      },
      required: ['a', 'b', 'u', 'en', 'on', 'optimal', 'e', 'm', 'n']
    })
  })
})
