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
  enumeration,
  intersect,
  parseError,
  map
} from './Codec'
import { Left, Right } from './Either'
import { Just, Nothing } from './Maybe'
import { NonEmptyList } from './NonEmptyList'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import { always, identity } from './Function'

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
        new Error(
          'Problem with property "a": it does not exist in received object {}'
        )
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

    test('bigint error reporting', () => {
      expect(Codec.interface({ n: string }).decode({ b: BigInt(1) })).toEqual(
        Left(
          'Problem with property "n": it does not exist in received object {"b":"1"}'
        )
      )
    })
  })

  describe('custom', () => {
    it('provides a default schema', () => {
      expect(
        Codec.custom({ decode: always(Right(null)), encode: identity }).schema()
      ).toEqual({})
    })

    it('provides a free unsafeDecode method', () => {
      expect(() =>
        Codec.custom({
          decode: always(Left('Error')),
          encode: identity
        }).unsafeDecode(0)
      ).toThrowError(Error('Error'))
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
      expect(string.decode(Symbol())).toEqual(
        Left('Expected a string, but received a symbol')
      )
      expect(string.decode(() => {})).toEqual(
        Left('Expected a string, but received a function')
      )
      expect(string.decode(BigInt(10))).toEqual(
        Left('Expected a string, but received a bigint with value 10')
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
          'Problem with the value at index 0: Expected a number, but received a string with value ""'
        )
      )
      expect(numberArray.decode([0, ''])).toEqual(
        Left(
          'Problem with the value at index 1: Expected a number, but received a string with value ""'
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
          'Problem with the value of property "a": Expected a number, but received a boolean'
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
          'Problem with key type of property "a": Expected a number, but received a string with value "a"'
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

    describe('encode', () => {
      test('basic usage', () => {
        expect(mockCodec.encode('')).toEqual('')
        expect(mockCodec.encode(false)).toEqual(false)
      })

      test('with custom primitive', () => {
        const fancyStringCodec = Codec.custom<string>({
          decode: (x) => string.decode(x).map((x) => x + '!'),
          encode: (x) => x.substring(0, x.length - 1)
        })

        const fancyNumberCodec = Codec.custom<number>({
          decode: (x) => number.decode(x).map((x) => x - 1),
          encode: (input) => input + 1
        })

        const fancyMockCodec = oneOf([fancyStringCodec, fancyNumberCodec])

        expect(fancyMockCodec.encode('always!')).toEqual('always')
        expect(fancyMockCodec.encode(1)).toEqual(2)
      })

      test('with ADTs', () => {
        const Inc10 = Codec.custom<number>({
          decode: (x) => number.decode(x).map((x) => x + 10),
          encode: (x) => x - 10
        })

        const Calculator = oneOf([
          Codec.interface({ tag: exactly('Increment'), value: Inc10 }),
          Codec.interface({ tag: exactly('Show'), value: number })
        ])

        expect(Calculator.encode({ tag: 'Increment', value: 20 })).toEqual({
          tag: 'Increment',
          value: 10
        })
        expect(Calculator.encode({ tag: 'Show', value: 20 })).toEqual({
          tag: 'Show',
          value: 20
        })
      })
    })
  })

  describe('exactly', () => {
    test('decode', () => {
      expect(exactly(0).decode(10)).toEqual(
        Left('Expected 0, but received a number with value 10')
      )
      expect(exactly(0).decode('')).toEqual(
        Left('Expected 0, but received a string with value ""')
      )

      expect(exactly(0).decode(0)).toEqual(Right(0))

      expect(exactly('a').decode('b')).toEqual(
        Left('Expected "a", but received a string with value "b"')
      )
      expect(exactly('a').decode('')).toEqual(
        Left('Expected "a", but received a string with value ""')
      )

      expect(exactly('a').decode('a')).toEqual(Right('a'))

      expect(exactly(true).decode(false)).toEqual(
        Left('Expected true, but received a boolean')
      )
      expect(exactly(true).decode('')).toEqual(
        Left('Expected true, but received a string with value ""')
      )

      expect(exactly(true).decode(true)).toEqual(Right(true))
    })

    test('decode multiple', () => {
      expect(exactly(0, 'a').decode(0)).toEqual(Right(0))
      expect(exactly(0, 'a').decode('a')).toEqual(Right('a'))

      expect(exactly(0, false).decode(true)).toEqual(
        Left('Expected 0, false, but received a boolean')
      )
    })

    test('encode', () => {
      expect(exactly(0).encode(0)).toEqual(0)
      expect(exactly('a').encode('a')).toEqual('a')
      expect(exactly(true).encode(true)).toEqual(true)
      expect(exactly(0, 'a').encode(0)).toEqual(0)
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

    test('decode inside object', () => {
      const obj = Codec.interface({
        a: maybe(number)
      })

      expect(obj.decode({})).toEqual(Right({ a: Nothing }))
      expect(obj.decode({ a: 5 })).toEqual(Right({ a: Just(5) }))
      expect(obj.decode({ a: '' })).toEqual(
        Left(
          'Problem with the value of property "a": Expected a number, but received a string with value ""'
        )
      )
    })

    test('encode', () => {
      const maybeNumber = maybe(number)

      expect(maybeNumber.encode(Nothing)).toEqual(undefined)
      expect(maybeNumber.encode(Just(0))).toEqual(0)
    })

    test('encode should call inner codec', () => {
      const mockCodec = Codec.custom<number>({
        decode: number.decode,
        encode: (input: number) => input + 1
      })
      const codec = Codec.interface({
        a: maybe(mockCodec)
      })

      expect(codec.encode({ a: Just(1) })).toEqual({ a: 2 })
      expect(codec.encode({ a: Nothing })).toEqual({ a: undefined })
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
          'Problem with the value at index 0: Expected a number, but received a string with value ""'
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
        2, 3, 4
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
          'Problem with the value at index 0: Expected a number, but received a string with value ""'
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
        Left(
          'One of the following problems occured: (0) Expected a string, but received null, (1) Expected a number, but received null'
        )
      )
    })

    test('encode', () => {
      expect(enumeration(Test).encode(Test.Test1)).toEqual('Test1')
      expect(enumeration(NumTest).encode(NumTest.NumTest1)).toEqual(0)
    })
  })

  describe('intersect', () => {
    const a = Codec.interface({ a: number })
    const b = Codec.interface({ b: string })

    test('decode', () => {
      expect(intersect(a, b).decode({ a: 5, b: '' })).toEqual(
        Right({ a: 5, b: '' })
      )
      expect(intersect(a, b).decode({ a: 5 })).toEqual(
        Left(
          'Problem with property "b": it does not exist in received object {"a":5}'
        )
      )
      expect(intersect(a, b).decode({ b: '' })).toEqual(
        Left(
          'Problem with property "a": it does not exist in received object {"b":""}'
        )
      )
    })

    test('encode', () => {
      expect(intersect(a, b).encode({ a: 5, b: '' })).toEqual({ a: 5, b: '' })
    })
  })

  describe('map', () => {
    test('decode', () => {
      expect(
        map(string, boolean).decode([
          ['a', true],
          ['b', false]
        ])
      ).toEqual(
        Right(
          new Map([
            ['a', true],
            ['b', false]
          ])
        )
      )

      expect(
        map(string, boolean).decode([
          ['a', true, 'junk'],
          ['b', false]
        ])
      ).toEqual(
        Left(
          'Problem with the value at index 0: Expected an array of length 2, but received an array with length of 3'
        )
      )
    })

    test('encode', () => {
      const codec = map(string, number)

      const testMap = new Map()
      testMap.set('a', 5)
      testMap.set('b', 10)

      expect(codec.encode(testMap)).toEqual([
        ['a', 5],
        ['b', 10]
      ])
    })
  })

  describe('JSON schema', () => {
    describe('expectations', () => {
      enum E {
        E1 = 'E1',
        E2 = 'E2'
      }

      interface Dog {
        dog: Dog
      }

      const Dog: Codec<Dog> = Codec.interface({
        dog: lazy(() => Dog)
      })

      const God = intersect(
        Codec.interface({
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
          ee: exactly('SSS', 'DDD'),
          m: maybe(tuple([number, number])),
          n: nonEmptyList(date)
        }),
        Dog
      )

      expect(God.schema()).toEqual({
        allOf: [
          {
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
                  { type: 'array', items: { type: 'string' } },
                  { type: 'object', additionalProperties: { type: 'string' } }
                ]
              },
              optimal: { type: 'string' },
              e: { type: 'string', enum: ['SSS'] },
              ee: {
                oneOf: [
                  { type: 'string', enum: ['SSS'] },
                  { type: 'string', enum: ['DDD'] }
                ]
              },
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
                items: { type: 'string', format: 'date-time' },
                minItems: 1
              }
            },
            required: ['a', 'b', 'u', 'en', 'on', 'optimal', 'e', 'ee', 'n']
          },
          {
            properties: {
              dog: {
                $comment:
                  'Lazy codecs are not supported when generating a JSON schema'
              }
            },
            required: ['dog'],
            type: 'object'
          }
        ]
      })
    })

    describe('ajv compatibility', () => {
      const ajv = new Ajv({ strict: true, validateSchema: true })
      addFormats(ajv)

      enum TestEnum {
        A,
        B
      }

      expect(ajv.validate(unknown.schema(), 'anything')).toBe(true)
      expect(ajv.validate(enumeration(TestEnum).schema(), TestEnum.A)).toBe(
        true
      )
      expect(ajv.validate(oneOf([number, string]).schema(), 4)).toBe(true)
      expect(ajv.validate(array(number).schema(), [1, 2, 3])).toBe(true)
      expect(ajv.validate(record(string, string).schema(), { a: 'test' })).toBe(
        true
      )
      expect(ajv.validate(exactly(true).schema(), true)).toBe(true)
      expect(ajv.validate(maybe(number).schema(), 42)).toBe(true)
      expect(ajv.validate(maybe(number).schema(), null)).toBe(true)
      expect(ajv.validate(maybe(unknown).schema(), { hehe: true })).toBe(true)
      expect(ajv.validate(nullable(unknown).schema(), { hehe: true })).toBe(
        true
      )
      expect(ajv.validate(nullable(number).schema(), null)).toBe(true)
      expect(ajv.validate(nonEmptyList(string).schema(), ['a'])).toBe(true)
      expect(ajv.validate(nonEmptyList(string).schema(), [])).toBe(false)
      expect(
        ajv.validate(tuple([number, string, boolean]).schema(), [5, 'b', false])
      ).toBe(true)
      expect(ajv.validate(tuple([number]).schema(), [5, 'b'])).toBe(false)
      expect(ajv.validate(date.schema(), new Date().toISOString())).toBe(true)
      expect(
        ajv.validate(
          intersect(
            Codec.interface({ a: number }),
            Codec.interface({ b: number })
          ).schema(),
          { a: 0, b: 1 }
        )
      ).toBe(true)
      expect(
        ajv.validate(map(number, boolean).schema(), [
          [5, true],
          [0, false]
        ])
      ).toBe(true)
    })
  })
})

describe('parseError', () => {
  describe('failure type', () => {
    test('string + number', () => {
      expect(
        parseError('Expected a string, but received a number with value 0')
      ).toEqual({
        type: 'failure',
        expectedType: 'string',
        receivedType: 'number',
        receivedValue: 0
      })

      expect(
        parseError('Expected a number, but received a string with value ""')
      ).toEqual({
        type: 'failure',
        expectedType: 'number',
        receivedType: 'string',
        receivedValue: ''
      })
    })

    test('boolean + null', () => {
      expect(parseError('Expected a boolean, but received null')).toEqual({
        type: 'failure',
        expectedType: 'boolean',
        receivedType: 'null'
      })

      expect(parseError('Expected a null, but received a boolean')).toEqual({
        type: 'failure',
        expectedType: 'null',
        receivedType: 'boolean'
      })
    })

    test('array + object', () => {
      expect(
        parseError('Expected an object, but received an array with value []')
      ).toEqual({
        type: 'failure',
        expectedType: 'object',
        receivedType: 'array',
        receivedValue: []
      })

      expect(
        parseError(
          'Expected an array, but received an object with value {"a": 5}'
        )
      ).toEqual({
        type: 'failure',
        expectedType: 'array',
        receivedType: 'object',
        receivedValue: { a: 5 }
      })
    })

    test('undefined', () => {
      expect(parseError('Expected an undefined, but received null')).toEqual({
        type: 'failure',
        expectedType: 'undefined',
        receivedType: 'null'
      })
    })

    test('enum', () => {
      expect(
        parseError(
          'Expected an enum member, but received a number with value 0'
        )
      ).toEqual({
        type: 'failure',
        expectedType: 'enum',
        receivedType: 'number',
        receivedValue: 0
      })
    })

    test('symbol', () => {
      expect(parseError('Expected a string, but received a symbol')).toEqual({
        type: 'failure',
        expectedType: 'string',
        receivedType: 'symbol'
      })
    })

    test('function', () => {
      expect(parseError('Expected a string, but received a function')).toEqual({
        type: 'failure',
        expectedType: 'string',
        receivedType: 'function'
      })
    })

    test('bigint', () => {
      expect(
        parseError('Expected a string, but received a bigint with value 10')
      ).toEqual({
        type: 'failure',
        expectedType: 'string',
        receivedType: 'bigint'
      })
    })

    test('date', () => {
      expect(
        parseError(
          'Problem with date string: Expected a string, but received null'
        )
      ).toEqual({
        type: 'failure',
        expectedType: 'string',
        receivedType: 'null'
      })
    })

    test('exactly', () => {
      expect(
        parseError('Expected "a", but received a string with value "b"')
      ).toEqual({
        type: 'failure',
        receivedType: 'string',
        receivedValue: 'b'
      })
    })
  })

  describe('oneOf type', () => {
    it('should work', () => {
      expect(
        parseError(
          'One of the following problems occured: (0) Expected a string, but received a number with value 0, (1) Expected a boolean, but received a number with value 0'
        )
      ).toEqual({
        type: 'oneOf',
        errors: [
          {
            type: 'failure',
            expectedType: 'string',
            receivedType: 'number',
            receivedValue: 0
          },
          {
            type: 'failure',
            expectedType: 'boolean',
            receivedType: 'number',
            receivedValue: 0
          }
        ]
      })
    })
  })

  describe('property type', () => {
    test('missing property', () => {
      expect(
        parseError(
          'Problem with property "a": it does not exist in received object {"b": 5}'
        )
      ).toEqual({
        type: 'property',
        property: 'a',
        error: {
          type: 'failure',
          receivedType: 'undefined'
        }
      })
    })

    test('bad property', () => {
      expect(
        parseError(
          'Problem with the value of property "a": Expected a number, but received a string with value ""'
        )
      ).toEqual({
        type: 'property',
        property: 'a',
        error: {
          type: 'failure',
          expectedType: 'number',
          receivedType: 'string',
          receivedValue: ''
        }
      })
    })

    test('bad key', () => {
      expect(
        parseError(
          'Problem with key type of property "a": Expected a number, but received a string with value "a"'
        )
      ).toEqual({
        type: 'property',
        property: 'a',
        error: {
          type: 'failure',
          expectedType: 'number',
          receivedType: 'string',
          receivedValue: 'a'
        }
      })
    })
  })

  describe('index type', () => {
    it('should work', () => {
      expect(
        parseError(
          'Problem with the value at index 1: Expected a number, but received a string with value ""'
        )
      ).toEqual({
        type: 'index',
        index: 1,
        error: {
          type: 'failure',
          expectedType: 'number',
          receivedType: 'string',
          receivedValue: ''
        }
      })
    })
  })

  describe('custom', () => {
    test('date', () => {
      expect(
        parseError(
          'Expected a valid date string, but received a string that cannot be parsed'
        )
      ).toEqual({
        type: 'custom',
        message:
          'Expected a valid date string, but received a string that cannot be parsed'
      })
    })

    test('nonEmptyList', () => {
      expect(
        parseError(
          'Expected an array with one or more elements, but received an empty array'
        )
      ).toEqual({
        type: 'custom',
        message:
          'Expected an array with one or more elements, but received an empty array'
      })
    })
  })

  test('nested errors', () => {
    expect(
      parseError(
        'Problem with the value of property "payload": Problem with the value of property "foo": Problem with the value of property "Foo": Problem with the value of property "reports": Problem with the value at index 1: Problem with the value of property "headers": Problem with the value at index 0: Problem with the value of property "style": One of the following problems occured: (0) Problem with property "hidden": it does not exist in received object {"visible":["bar"]}, (1) Expected an undefined, but received an object with value {"visible":["bar"]}'
      )
    ).toEqual({
      error: {
        error: {
          error: {
            error: {
              error: {
                error: {
                  error: {
                    error: {
                      errors: [
                        {
                          error: {
                            receivedType: 'undefined',
                            type: 'failure'
                          },
                          property: 'hidden',
                          type: 'property'
                        },
                        {
                          expectedType: 'undefined',
                          receivedType: 'object',
                          receivedValue: {
                            visible: ['bar']
                          },
                          type: 'failure'
                        }
                      ],
                      type: 'oneOf'
                    },
                    property: 'style',
                    type: 'property'
                  },
                  index: 0,
                  type: 'index'
                },
                property: 'headers',
                type: 'property'
              },
              index: 1,
              type: 'index'
            },
            property: 'reports',
            type: 'property'
          },
          property: 'Foo',
          type: 'property'
        },
        property: 'foo',
        type: 'property'
      },
      property: 'payload',
      type: 'property'
    })
  })
})
