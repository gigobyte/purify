import { Just, Nothing } from './Maybe'
import { Tuple } from './Tuple'
import { NonEmptyList } from './NonEmptyList'

describe('NonEmptyList', () => {
  test('NonEmptyList', () => {
    expect(NonEmptyList([5])).toEqual([5])
  })

  test('isNonEmpty', () => {
    expect(NonEmptyList.isNonEmpty([])).toEqual(false)
    expect(NonEmptyList.isNonEmpty([1])).toEqual(true)
  })

  test('fromArray', () => {
    expect(NonEmptyList.fromArray([])).toEqual(Nothing)
    expect(NonEmptyList.fromArray([1])).toEqual(Just(NonEmptyList([1])))
  })

  test('fromTuple', () => {
    expect(NonEmptyList.fromTuple(Tuple(1, 'test'))).toEqual(
      NonEmptyList([1, 'test'])
    )
  })

  test('head', () => {
    expect(NonEmptyList.head(NonEmptyList([1]))).toEqual(1)
  })

  test('last', () => {
    expect(NonEmptyList.last(NonEmptyList([1]))).toEqual(1)
  })

  test('tail', () => {
    expect(NonEmptyList.tail(NonEmptyList([1, 2, 3]))).toEqual([2, 3])
    expect(NonEmptyList.tail(NonEmptyList([1]))).toEqual([])
  })

  test('unsafeCoerce', () => {
    expect(() => NonEmptyList.unsafeCoerce([])).toThrow()
    expect(NonEmptyList.unsafeCoerce([1])).toEqual(NonEmptyList([1]))
  })

  it('Should handle all Array.prototype methods', () => {
    expect(NonEmptyList([1]).map((_) => 'always string')).toEqual(
      NonEmptyList(['always string'])
    )
    expect(NonEmptyList([1]).filter((_) => true)).toEqual(NonEmptyList([1]))
  })

  it('Should not lose type info when using Array.prototype methoids', () => {
    const a: NonEmptyList<string> = NonEmptyList([1]).map((_) => '')
    const b: NonEmptyList<number> = NonEmptyList([1]).reverse()
  })
})
