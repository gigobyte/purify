import { tsst } from 'tsst-tycho';
import * as Maybe from '../src/Maybe'
import * as Either from '../src/Either'

// Used to mask Lefts or Rights as Either
type FakeEither = Either.Either<string, number>;

describe('Either', () => {
    it('Left', () => {
        expect(Either.Left(5).value).toBe(5)
    })

    it('Right', () => {
        expect(Either.Right(5).value).toBe(5)
    })

    it('isLeft', () => {
        expect(Either.isLeft(Either.Left(5))).toBe(true)
        expect(Either.isLeft(Either.Right(5))).toBe(false)
    })

    it('isRight', () => {
        expect(Either.isRight(Either.Right(5))).toBe(true)
        expect(Either.isRight(Either.Left(5))).toBe(false)
    })

    it('bimap', () => {
        expect(Either.bimap(x => x + '!', x => x + 1, Either.Left('Error'))).toEqual(Either.Left('Error!'))
        expect(Either.bimap(x => x + '!', x => x + 1, Either.Right(5))).toEqual(Either.Right(6))
    })

    it('mapLeft', () => {
        expect(Either.mapLeft(x => x + '!', Either.Left('Error'))).toEqual(Either.Left('Error!'))
        expect(Either.mapLeft(x => x + '!', Either.Right(5))).toEqual(Either.Right(5))
    })

    it('mapRight', () => {
        expect(Either.mapRight(x => x + 1, Either.Left('Error'))).toEqual(Either.Left('Error'))
        expect(Either.mapRight(x => x + 1, Either.Right(5))).toEqual(Either.Right(6))
    })

    it('liftLeft', () => {
        expect(Either.liftLeft((x: string) => x + '!')(Either.Left('Error'))).toEqual(Either.Left('Error!'))
        expect(Either.liftLeft((x: string) => x + '!')(Either.Right(5))).toEqual(Either.Right(5))
    })

    it('liftRight', () => {
        expect(Either.liftRight((x: number) => x + 1)(Either.Left('Error'))).toEqual(Either.Left('Error'))
        expect(Either.liftRight((x: number) => x + 1)(Either.Right(5))).toEqual(Either.Right(6))
    })

    it('caseOf', () => {
        expect(Either.caseOf(Either.Left('Error'), { Left: x => x, Right: () => 'No error' })).toBe('Error')
        expect(Either.caseOf(Either.Right('Result'), { Left: x => x, Right: () => 'No error' })).toBe('No error')
    })

    it('leftOrDefault', () => {
        expect(Either.leftOrDefault('No error', Either.Left('Custom error'))).toBe('Custom error')
        expect(Either.leftOrDefault('No error', Either.Right(5))).toBe('No error')
    })

    it('rightOrDefault', () => {
        expect(Either.rightOrDefault(0, Either.Left('Error'))).toBe(0)
        expect(Either.rightOrDefault(0, Either.Right(5))).toBe(5)
    })

    it('whenLeft', () => {
        let a = 0
        Either.whenLeft(_ => { a = 5 }, Either.Left('Error'))
        expect(a).toBe(5)

        let b = 0
        Either.whenLeft(_ => { b = 5 }, Either.Right(5))
        expect(b).toBe(0)
    })

    it('whenRight', () => {
        let a = 0
        Either.whenRight(_ => { a = 5 }, Either.Left('Error'))
        expect(a).toBe(0)

        let b = 0
        Either.whenRight(_ => { b = 5 }, Either.Right(5))
        expect(b).toBe(5)
    })

    it('leftToMaybe', () => {
        expect(Either.leftToMaybe(Either.Left('Error'))).toBe(Maybe.Just('Error'))
        expect(Either.leftToMaybe(Either.Right(5))).toBe(Maybe.Nothing)
    })

    it('rightToMaybe', () => {
        expect(Either.rightToMaybe(Either.Left('Error'))).toBe(Maybe.Nothing)
        expect(Either.rightToMaybe(Either.Right(5))).toBe(Maybe.Just(5))
    })

    it('liftA2', () => {
        expect(Either.liftA2((x, y) => x + y, Either.Right(5), Either.Right(1))).toEqual(Either.Right(6))
        expect(Either.liftA2((x, y) => x + y, Either.Left('Error'), Either.Right(1))).toEqual(Either.Left('Error'))
        expect(Either.liftA2((x, y) => x + y, Either.Right(1) as FakeEither, Either.Left('Error') as FakeEither)).toEqual(Either.Left('Error'))
        expect(Either.liftA2((x, y) => x + y, Either.Left('Error'), Either.Left('Error'))).toEqual(Either.Left('Error'))
    })

    it('lefts', () => {
        expect(Either.lefts([Either.Left('NullPointer'), Either.Left('OutOfRange'), Either.Right(5)])).toEqual(['NullPointer', 'OutOfRange'])
    })

    it('rights', () => {
        expect(Either.rights([Either.Left('NullPointer'), Either.Left('OutOfRange'), Either.Right(5)])).toEqual([5])
    })

    it('either', () => {
        expect(Either.either(x => x + '!', x => String(x), Either.Left('Error'))).toBe('Error!')
        expect(Either.either(x => x + '!', x => String(x), Either.Right(5))).toBe('5')
    })

    it('equals', () => {
        expect(Either.equals(Either.Left('Err'), Either.Left('Err'))).toBe(true)
        expect(Either.equals(Either.Left('Err'), Either.Left('Error'))).toBe(false)
        expect(Either.equals(Either.Left('Err'), Either.Right('Err'))).toBe(false)
        expect(Either.equals(Either.Right(5), Either.Right(5))).toBe(true)
        expect(Either.equals(Either.Right(5), Either.Right(6))).toBe(false)
        expect(Either.equals(Either.Right(5), Either.Left(5))).toBe(false)
    })

    it('alt', () => {
        expect(Either.alt(Either.Left('Err'), Either.Left('Error'))).toEqual(Either.Left('Error'))
        expect(Either.alt(Either.Left('Err') as FakeEither, Either.Right(5))).toEqual(Either.Right(5))
        expect(Either.alt(Either.Right(5) as FakeEither, Either.Left('Error'))).toEqual(Either.Right(5))
        expect(Either.alt(Either.Right(5), Either.Right(6))).toEqual(Either.Right(5))
    })

    it('ap', () => {
        type FakeEitherFn = Either.Either <string, (_: number) => number>

        expect(Either.ap(Either.Right((x: number) => x + 1) as FakeEitherFn, Either.Right(5))).toEqual(Either.Right(6))
        expect(Either.ap(Either.Right((x: number) => x + 1) as FakeEitherFn, Either.Left('Error') as FakeEither)).toEqual(Either.Left('Error'))
        expect(Either.ap(Either.Left('Error') as FakeEitherFn, Either.Right(5))).toEqual(Either.Left('Error'))
        expect(Either.ap(Either.Left('Error') as FakeEitherFn, Either.Left('Error!') as FakeEither)).toEqual(Either.Left('Error'))
    })

    it('chain', () => {
        expect(Either.chain(x => Either.Right(x + 1), Either.Left('Error'))).toEqual(Either.Left('Error'))
        expect(Either.chain(x => Either.Right(x + 1), Either.Right(5))).toEqual(Either.Right(6))
    })

    it('extract', () => {
        expect(Either.extract(Either.Left(5))).toEqual(5)
        expect(Either.extract(Either.Right(5))).toEqual(5)
        tsst(() => { const a: number | string = Either.extract(Either.Left(5)) }).expectToCompile
    })
})