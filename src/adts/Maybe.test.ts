import { Maybe, Just, Nothing } from './Maybe'
import { Left, Right } from './Either'

describe('Maybe', () => {
    test('of', () => {
        expect(Maybe.of(5)).toEqual(Just(5))
    })

    test('fromNullable', () => {
        expect(Maybe.fromNullable(null)).toEqual(Nothing)
        expect(Maybe.fromNullable(5)).toEqual(Just(5))
    })

    test('fromFalsy', () => {
        expect(Maybe.fromFalsy(0)).toEqual(Nothing)
        expect(Maybe.fromFalsy('')).toEqual(Nothing)
        expect(Maybe.fromFalsy(5)).toEqual(Just(5))
    })

    test('empty', () => {
        expect(Maybe.empty()).toEqual(Nothing)
    })

    test('zero', () => {
        expect(Maybe.zero()).toEqual(Nothing)
    })

    test('catMaybes', () => {
        expect(Maybe.catMaybes([Just(5), Nothing, Just(10)])).toEqual([5, 10])
        expect(Maybe.catMaybes([Nothing])).toEqual([])
    })

    test('mapMaybe', () => {
        expect(Maybe.mapMaybe(x => x > 5 ? Just(x) : Nothing)([1,2,3,7,8,9])).toEqual([7,8,9])
        expect(Maybe.mapMaybe(x => x > 5 ? Just(x) : Nothing, [1,2,3,7,8,9])).toEqual([7,8,9])
    })

    test('encase', () => {
        expect(Maybe.encase(() => { throw new Error('a') })).toEqual(Nothing)
        expect(Maybe.encase(() => 10)).toEqual(Just(10))
    })

    test('isJust', () => {
        expect(Just(5).isJust()).toEqual(true)
        expect(Nothing.isJust()).toEqual(false)
    })

    test('isNothing', () => {
        expect(Just(5).isNothing()).toEqual(false)
        expect(Nothing.isNothing()).toEqual(true)
    })

    test('equals', () => {
        expect(Just(5).equals(Just(5))).toEqual(true)
        expect(Just(5).equals(Just(10))).toEqual(false)
        expect(Just(5).equals(Nothing)).toEqual(false)
        expect(Nothing.equals(Just(5 as never))).toEqual(false)
        expect(Nothing.equals(Nothing)).toEqual(true)
    })

    test('lte', () => {
        expect(Just(5).lte(Just(0))).toEqual(false)
        expect(Just(5).lte(Just(5))).toEqual(true)
        expect(Just(5).lte(Just(10))).toEqual(true)
        expect(Just(5).lte(Nothing)).toEqual(false)
        expect(Nothing.lte(Just(5 as never))).toEqual(true)
        expect(Nothing.lte(Nothing)).toEqual(true)
    })

    test('concat', () => {
        expect(Just([1,2,3]).concat(Just([7,8,9]))).toEqual(Just([1,2,3,7,8,9]))
        expect(Just([1,2,3]).concat(Nothing)).toEqual(Just([1,2,3]))
        expect(Nothing.concat(Just([1,2,3] as never))).toEqual(Just([1, 2, 3]))
        expect(Nothing.concat(Nothing)).toEqual(Nothing)
    })

    test('map', () => {
        expect(Just(5).map(x => x + 1)).toEqual(Just(6))
        expect(Nothing.map(x => x + 1)).toEqual(Nothing)
    })

    test('ap', () => {
        expect(Just(5).ap(Just((x: number) => x + 1))).toEqual(Just(6))
        expect(Just(5).ap(Nothing)).toEqual(Nothing)
        expect(Nothing.ap(Just((x: number) => x + 1))).toEqual(Nothing)
        expect(Nothing.ap(Nothing)).toEqual(Nothing)
    })

    test('alt', () => {
        expect(Just(5).alt(Just(6))).toEqual(Just(5))
        expect(Just(5).alt(Nothing)).toEqual(Just(5))
        expect(Nothing.alt(Just(5 as never))).toEqual(Just(5))
        expect(Nothing.alt(Nothing)).toEqual(Nothing)
    })

    test('chain', () => {
        expect(Just(5).chain(x => Just(x + 1))).toEqual(Just(6))
        expect(Nothing.chain(x => Just(x + 1))).toEqual(Nothing)
    })

    test('reduce', () => {
        expect(Just(5).reduce((acc, x) => x * acc, 2)).toEqual(10)
        expect(Nothing.reduce((acc, x) => x * acc, 0)).toEqual(0)
    })

    test('extend', () => {
        expect(Just(5).extend(x => x.isJust())).toEqual(Just(true))
        expect(Nothing.extend(x => x.isJust())).toEqual(Nothing)
    })

    test('unsafeCoerce', () => {
        expect(Just(5).unsafeCoerce()).toEqual(5)
        expect(() => Nothing.unsafeCoerce()).toThrow()
    })

    test('caseOf', () => {
        expect(Just(5).caseOf({ Just: x => x + 1, Nothing: () => 0 })).toEqual(6)
        expect(Nothing.caseOf({ Just: x => x + 1, Nothing: () => 0 })).toEqual(0)
    })

    test('orDefault', () => {
        expect(Just(5).orDefault(0)).toEqual(5)
        expect(Nothing.orDefault(0 as never)).toEqual(0)
    })

    test('orDefaultLazy', () => {
        expect(Just(5).orDefaultLazy(() => 0)).toEqual(5)
        expect(Nothing.orDefaultLazy(() => 0 as never)).toEqual(0)
    })

    test('toList', () => {
        expect(Just(5).toList()).toEqual([5])
        expect(Nothing.toList()).toEqual([])
    })

    test('mapOrDefault', () => {
        expect(Just(5).mapOrDefault(x => x + 1, 0)).toEqual(6)
        expect(Nothing.mapOrDefault(x => x + 1, 0)).toEqual(0)
    })

    test('extract', () => {
        expect(Just(5).extract()).toEqual(5)
        expect(Nothing.extract()).toEqual(null)
    })

    test('toEither', () => {
        expect(Just(5).toEither('Error')).toEqual(Right(5))
        expect(Nothing.toEither('Error')).toEqual(Left('Error'))
    })

    test('ifJust', () => {
        let a = 0
        Just(5).ifJust(() => { a = 5 })
        expect(a).toEqual(5)

        let b = 0
        Nothing.ifJust(() => { b = 5 })
        expect(b).toEqual(0)
    })

    test('ifNothing', () => {
        let a = 0
        Just(5).ifNothing(() => { a = 5 })
        expect(a).toEqual(0)

        let b = 0
        Nothing.ifNothing(() => { b = 5 })
        expect(b).toEqual(5)
    })

    test('filter', () => {
        expect(Just(5).filter(x => x > 10)).toEqual(Nothing)
        expect(Just(5).filter(x => x > 0)).toEqual(Just(5))
        expect(Nothing.filter(x => x > 0)).toEqual(Nothing)
    })
})