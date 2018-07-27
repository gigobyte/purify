import { Just, Nothing } from './Maybe'
import { Tuple } from './Tuple'
import { NonEmptyList, head, last, isNonEmpty } from './NonEmptyList'

describe('NonEmptyList', () => {
    test('NonEmptyList', () => {
        expect(NonEmptyList([5])).toEqual([5])
    })

    test('isNonEmpty', () => {
        expect(isNonEmpty([])).toEqual(false)
        expect(isNonEmpty([1])).toEqual(true)
    })

    test('fromArray', () => {
        expect(NonEmptyList.fromArray([])).toEqual(Nothing)
        expect(NonEmptyList.fromArray([1])).toEqual(Just(NonEmptyList([1])))
    })

    test('fromTuple', () => {
        expect(NonEmptyList.fromTuple(Tuple(1, 2))).toEqual(NonEmptyList([1, 2]))
    })

    test('head', () => {
        expect(head(NonEmptyList([1]))).toEqual(1)
    })

    test('last', () => {
        expect(last(NonEmptyList([1]))).toEqual(1)
    })

    test('unsafeCoerce', () => {
        expect(() => NonEmptyList.unsafeCoerce([])).toThrow()
        expect(NonEmptyList.unsafeCoerce([1])).toEqual(NonEmptyList([1]))
    })

    it('Should handle all Array.prototype methods', () => {
        const a: NonEmptyList<string> = NonEmptyList([1]).map(_ => 'always string')
    })
})