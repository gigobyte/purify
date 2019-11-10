import {
  Codec,
  number,
  string,
  oneOf,
  nullType,
  undefinedType,
  boolean,
  unknown,
  array,
  record,
  exactly,
  maybe,
  nonEmptyList,
  tuple
} from './Codec'
import { Left, Right } from './Either'
import { Just, Nothing } from './Maybe'
import { NonEmptyList } from './NonEmptyList'

describe('Codec', () => {
  describe('interface', () => {
    const mockCodec = Codec.interface({
      a: number,
      b: string
    })

    test('decode', () => {
      const failingInputs = [0, {}, undefined, null, false, { a: 0 }, { b: '' }]

      failingInputs.forEach(input => {
        expect(mockCodec.decode(input)).toEqual(Left('fail'))
      })

      expect(mockCodec.decode({ a: 0, b: '' })).toEqual(Right({ a: 0, b: '' }))
      expect(mockCodec.decode({ a: 0, b: '', c: '' })).toEqual(
        Right({ a: 0, b: '' })
      )
    })

    test('encode', () => {
      expect(mockCodec.encode({ a: 0, b: '' })).toEqual({ a: 0, b: '' })
      expect(mockCodec.encode({ a: 0, b: '', c: '' } as any)).toEqual({
        a: 0,
        b: ''
      })
      expect(mockCodec.encode({} as any)).toEqual({})
    })
  })

  describe('string', () => {
    test('decode', () => {
      const failingInputs = [0, {}, undefined, null, false]

      failingInputs.forEach(input => {
        expect(string.decode(input)).toEqual(Left('fail'))
      })

      expect(string.decode('')).toEqual(Right(''))
    })

    test('encode', () => {
      expect(string.encode('')).toEqual('')
    })
  })

  describe('number', () => {
    test('decode', () => {
      const failingInputs = ['', {}, undefined, null, false]

      failingInputs.forEach(input => {
        expect(number.decode(input)).toEqual(Left('fail'))
      })

      expect(number.decode(0)).toEqual(Right(0))
    })

    test('encode', () => {
      expect(number.encode(0)).toEqual(0)
    })
  })

  describe('null', () => {
    test('decode', () => {
      const failingInputs = ['', {}, undefined, 0, false]

      failingInputs.forEach(input => {
        expect(nullType.decode(input)).toEqual(Left('fail'))
      })

      expect(nullType.decode(null)).toEqual(Right(null))
    })

    test('encode', () => {
      expect(nullType.encode(null)).toEqual(null)
    })
  })

  describe('undefined', () => {
    test('decode', () => {
      const failingInputs = ['', {}, null, 0, false]

      failingInputs.forEach(input => {
        expect(undefinedType.decode(input)).toEqual(Left('fail'))
      })

      expect(undefinedType.decode(undefined)).toEqual(Right(undefined))
    })

    test('encode', () => {
      expect(undefinedType.encode(undefined)).toEqual(undefined)
    })
  })

  describe('boolean', () => {
    test('decode', () => {
      const failingInputs = ['', {}, null, 0, undefined]

      failingInputs.forEach(input => {
        expect(boolean.decode(input)).toEqual(Left('fail'))
      })

      expect(boolean.decode(true)).toEqual(Right(true))
    })

    test('encode', () => {
      expect(boolean.encode(true)).toEqual(true)
    })
  })

  describe('unknown', () => {
    const inputs = ['', {}, null, 0, undefined, false]

    test('decode', () => {
      inputs.forEach(input => {
        expect(unknown.decode(input)).toEqual(Right(input))
      })
    })

    test('encode', () => {
      inputs.forEach(input => {
        expect(unknown.encode(input)).toEqual(input)
      })
    })
  })

  describe('array', () => {
    test('decode', () => {
      const failingInputs = ['', {}, null, 0, undefined, ['']]
      const numberArray = array(number)

      failingInputs.forEach(input => {
        expect(numberArray.decode(input)).toEqual(Left('fail'))
      })

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
      const failingInputs = ['', [], null, 0, undefined, { a: true }]
      const numberRecord = record(string, number)

      failingInputs.forEach(input => {
        expect(numberRecord.decode(input)).toEqual(Left('fail'))
      })

      expect(numberRecord.decode({})).toEqual(Right({}))
      expect(numberRecord.decode({ a: 0 })).toEqual(Right({ a: 0 }))
      expect(numberRecord.decode({ a: 0, b: 1 })).toEqual(Right({ a: 0, b: 1 }))
    })

    test('decode with number key', () => {
      const numberRecord = record(number, number)

      expect(numberRecord.decode({ a: 0 })).toEqual(Left('fail'))
      expect(numberRecord.decode({ 0: 0 })).toEqual(Right({ 0: 0 }))
    })

    test('encode', () => {
      const mockKeyCodec = Codec.custom<string>({
        decode: string.decode,
        encode: _ => 'haha'
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
      const failingInputs = [{}, undefined, 0, []]

      failingInputs.forEach(input => {
        expect(mockCodec.decode(input)).toEqual(Left('fail'))
      })

      expect(mockCodec.decode('')).toEqual(Right(''))
      expect(mockCodec.decode(false)).toEqual(Right(false))
    })

    test('encode', () => {
      expect(mockCodec.encode('')).toEqual('')
      expect(mockCodec.encode(false)).toEqual(false)

      const fancyStringCodec = Codec.custom<string>({
        decode: string.decode,
        encode: _ => 'always!'
      })

      const fancyNumberCodec = Codec.custom<number>({
        decode: number.decode,
        encode: input => input + 1
      })

      const fancyMockCodec = oneOf([fancyStringCodec, fancyNumberCodec])

      expect(fancyMockCodec.encode('')).toEqual('always!')
      expect(fancyMockCodec.encode(1)).toEqual(2)
      expect(fancyMockCodec.encode(true as any)).toEqual(true)
    })
  })

  describe('exactly', () => {
    test('decode', () => {
      expect(exactly(0).decode(10)).toEqual(Left('fail'))
      expect(exactly(0).decode('')).toEqual(Left('fail'))
      expect(exactly(0).decode(false)).toEqual(Left('fail'))

      expect(exactly(0).decode(0)).toEqual(Right(0))

      expect(exactly('a').decode('b')).toEqual(Left('fail'))
      expect(exactly('a').decode('')).toEqual(Left('fail'))
      expect(exactly('a').decode(false)).toEqual(Left('fail'))

      expect(exactly('a').decode('a')).toEqual(Right('a'))

      expect(exactly(true).decode(false)).toEqual(Left('fail'))
      expect(exactly(true).decode('')).toEqual(Left('fail'))
      expect(exactly(true).decode(0)).toEqual(Left('fail'))

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
      const failingInputs = ['', {}, [], false]
      const maybeNumber = maybe(number)

      failingInputs.forEach(input => {
        expect(maybeNumber.decode(input)).toEqual(Left('fail'))
      })

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
      const failingInputs = ['', {}, null, 0, undefined, [''], []]
      const numberNEL = nonEmptyList(number)

      failingInputs.forEach(input => {
        expect(numberNEL.decode(input)).toEqual(Left('fail'))
      })

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
      expect(tuple([number]).decode([])).toEqual(Left('fail'))
      expect(tuple([number]).decode([''])).toEqual(Left('fail'))
      expect(tuple([number]).decode([0, 1])).toEqual(Left('fail'))

      expect(tuple([number]).decode([0])).toEqual(Right([0]))
    })
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
