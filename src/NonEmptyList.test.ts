import { Just, Nothing } from './Maybe'
import { Tuple } from './Tuple'
import { NonEmptyList } from './NonEmptyList'

describe('NonEmptyList', () => {
  test('NonEmptyList', () => {
    expect(NonEmptyList([5])).toEqualStringified([5])
  })

  test('isNonEmpty', () => {
    expect(NonEmptyList.isNonEmpty([])).toEqualStringified(false)
    expect(NonEmptyList.isNonEmpty([1])).toEqualStringified(true)
  })

  test('fromArray', () => {
    expect(NonEmptyList.fromArray([])).toEqualStringified(Nothing)
    expect(NonEmptyList.fromArray([1])).toEqualStringified(
      Just(NonEmptyList([1]))
    )
  })

  test('fromTuple', () => {
    expect(NonEmptyList.fromTuple(Tuple(1, 'test'))).toEqualStringified(
      NonEmptyList([1, 'test'])
    )
  })

  test('head', () => {
    expect(NonEmptyList.head(NonEmptyList([1]))).toEqualStringified(1)
  })

  test('last', () => {
    expect(NonEmptyList.last(NonEmptyList([1]))).toEqualStringified(1)
  })

  test('unsafeCoerce', () => {
    expect(() => NonEmptyList.unsafeCoerce([])).toThrow()
    expect(NonEmptyList.unsafeCoerce([1])).toEqualStringified(NonEmptyList([1]))
  })

  it('Should handle all Array.prototype methods', () => {
    const a = NonEmptyList([1]).map(_ => 'always string')
    const b = NonEmptyList([1]).filter(_ => true)
  })
})
