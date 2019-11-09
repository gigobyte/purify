import * as t from 'io-ts'
import { Codec, number, string, oneOf, GetInterface, nullType } from './Codec'
import { Left, Right } from './Either'

describe('Codec', () => {
  describe('string', () => {
    test('decode', () => {
      expect(string.decode(0)).toEqual(Left('fail'))
      expect(string.decode({})).toEqual(Left('fail'))
      expect(string.decode(undefined)).toEqual(Left('fail'))
      expect(string.decode(null)).toEqual(Left('fail'))
      expect(string.decode(false)).toEqual(Left('fail'))

      expect(string.decode('')).toEqual(Right(''))
    })

    test('encode', () => {
      expect(string.encode('')).toEqual('')
    })
  })

  describe('number', () => {
    test('decode', () => {
      expect(number.decode('')).toEqual(Left('fail'))
      expect(number.decode({})).toEqual(Left('fail'))
      expect(number.decode(undefined)).toEqual(Left('fail'))
      expect(number.decode(null)).toEqual(Left('fail'))
      expect(string.decode(false)).toEqual(Left('fail'))

      expect(number.decode(0)).toEqual(Right(0))
    })

    test('encode', () => {
      expect(number.encode(0)).toEqual(0)
    })
  })

  describe('null', () => {
    test('decode', () => {
      expect(nullType.decode('')).toEqual(Left('fail'))
      expect(nullType.decode({})).toEqual(Left('fail'))
      expect(nullType.decode(undefined)).toEqual(Left('fail'))
      expect(nullType.decode(0)).toEqual(Left('fail'))
      expect(string.decode(false)).toEqual(Left('fail'))

      expect(nullType.decode(null)).toEqual(Right(null))
    })

    test('encode', () => {
      expect(nullType.encode(null)).toEqual(null)
    })
  })
})

// ---------------

const User = Codec.interface({
  userId: number,
  name: string,
  stupid: oneOf([number, string])
})

interface User extends GetInterface<typeof User> {}

const User2 = t.type({
  userId: t.number,
  name: t.string,
  stupid: t.union([t.number, t.string])
})

type User2 = t.TypeOf<typeof User2>

const u = User.decode({ userId: 2, name: 'dsa', dasda: 5 })
const u2 = User2.decode({ userId: 2, name: 'dsa', dasda: 5 })
