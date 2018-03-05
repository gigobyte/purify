import { tsst } from 'tsst-tycho';
import * as Maybe from '../src/Maybe'
import * as Either from '../src/Either'

describe('Maybe', () => {
    it('Just', () => {
        expect(Maybe.Just(5)).toBe(5)
        expect(Maybe.Just(null)).toBe(null)
    })

    it('Nothing', () => {
        expect(Maybe.Nothing).toBe(null)
    })

    it('of', () => {
        expect(Maybe.of(5)).toBe(5)
        expect(Maybe.of(null)).toBe(Maybe.Nothing)
    })

    it('weakOf', () => {
        expect(Maybe.weakOf(5)).toBe(5)
        expect(Maybe.weakOf(null)).toBe(Maybe.Nothing)
        expect(Maybe.weakOf('')).toBe(Maybe.Nothing)
        expect(Maybe.weakOf(0)).toBe(Maybe.Nothing)
    })

    it('isNothing', () => {
        expect(Maybe.isNothing(Maybe.Nothing)).toBe(true);
        expect(Maybe.isNothing(Maybe.Just(1))).toBe(false);
    })

    it('isJust', () => {
        expect(Maybe.isJust(Maybe.Nothing)).toBe(false);
        expect(Maybe.isJust(Maybe.Just(1))).toBe(true);
    })

    it('map', () => {
        expect(Maybe.map(x => x + 1, Maybe.Just(1))).toBe(Maybe.Just(2))
        expect(Maybe.map(x => x + 1, Maybe.Nothing)).toBe(Maybe.Nothing)
    })

    it('liftA2', () => {
        expect(Maybe.liftA2((x, y) => x + y, Maybe.Just(2), Maybe.Just(2))).toBe(Maybe.Just(4))
        expect(Maybe.liftA2((x, y) => x + y, Maybe.Just(2), Maybe.Nothing)).toBe(Maybe.Nothing)
        expect(Maybe.liftA2((x, y) => x + y, Maybe.Nothing, Maybe.Just(2))).toBe(Maybe.Nothing)
        expect(Maybe.liftA2((x, y) => x + y, Maybe.Nothing, Maybe.Nothing)).toBe(Maybe.Nothing)
    })

    it('chain', () => {
        expect(Maybe.chain(x => Maybe.Just(x + 1), Maybe.Just(1))).toBe(Maybe.Just(2))
        expect(Maybe.chain(x => Maybe.Just(x + 1), Maybe.Nothing)).toBe(Maybe.Nothing)
        tsst(() => { Maybe.chain(x => x + 1, Maybe.Nothing) }).expectToFailWith('is not assignable to parameter of type')
    })

    it('caseOf', () => {
        expect(Maybe.caseOf(Maybe.Just(5), {Just: x => x + 1, Nothing: () => 0})).toBe(6)
        expect(Maybe.caseOf(Maybe.Nothing, { Just: x => x + 1, Nothing: () => 0 })).toBe(0)
    })

    it('alt', () => {
        expect(Maybe.alt(Maybe.Just(5), Maybe.Just(6))).toBe(Maybe.Just(5))
        expect(Maybe.alt(Maybe.Nothing, Maybe.Just(6))).toBe(Maybe.Just(6))
        expect(Maybe.alt(Maybe.Just(5), Maybe.Nothing)).toBe(Maybe.Just(5))
        expect(Maybe.alt(Maybe.Nothing, Maybe.Nothing)).toBe(Maybe.Nothing)
    })

    it('ap', () => {
        expect(Maybe.ap(Maybe.Just((x: number) => x + 1), Maybe.Just(5))).toBe(Maybe.Just(6))
        expect(Maybe.ap(Maybe.Nothing, Maybe.Just(5))).toBe(Maybe.Nothing)
        expect(Maybe.ap(Maybe.Just((x: number) => x + 1), Maybe.Nothing)).toBe(Maybe.Nothing)
        expect(Maybe.ap(Maybe.Nothing, Maybe.Nothing)).toBe(Maybe.Nothing)
    })

    it('withDefault', () => {
        expect(Maybe.withDefault(5, Maybe.Just(6))).toBe(6)
        expect(Maybe.withDefault(5, Maybe.Nothing)).toBe(5)
    })

    it('lift', () => {
        expect(Maybe.lift((x: number) => x + 1)(Maybe.Just(1))).toBe(Maybe.Just(2))
        expect(Maybe.lift((x: number) => x + 1)(Maybe.Nothing)).toBe(Maybe.Nothing)
    })

    it('liftM', () => {
        expect(Maybe.liftM((x: number) => Maybe.Just(x + 1))(Maybe.Just(1))).toBe(Maybe.Just(2))
        expect(Maybe.liftM((x: number) => Maybe.Just(x + 1))(Maybe.Nothing)).toBe(Maybe.Nothing)
        tsst(() => { Maybe.chain((x: number) => x + 1, Maybe.Nothing) }).expectToFailWith('is not assignable to parameter of type')
    })

    it('toList', () => {
        expect(Maybe.toList(Maybe.Nothing)).toEqual([])
        expect(Maybe.toList(Maybe.Just(5))).toEqual([5])
    })

    it('catMaybes', () => {
        expect(Maybe.catMaybes([Maybe.Just(6), Maybe.Just(5), Maybe.Nothing])).toEqual([6, 5])
    })

    it('mapMaybe', () => {
        expect(Maybe.mapMaybe(x => x < 5 ? Maybe.Just(x) : Maybe.Nothing, [1,2,3,7,8,9])).toEqual([1,2,3])
    })

    it('mapWithDefault', () => {
        expect(Maybe.mapWithDefault(10, x => x + 1, Maybe.Just(2))).toBe(3)
        expect(Maybe.mapWithDefault(10, x => x + 1, Maybe.Nothing)).toBe(10)
    })

    it('concat', () => {
        expect(Maybe.concat(Maybe.Just([7, 8, 9]), Maybe.Just([1,2,3]))).toEqual(Maybe.Just([7,8,9,1,2,3]))
        expect(Maybe.concat(Maybe.Just([1,2,3]), Maybe.Nothing)).toEqual(Maybe.Just([1,2,3]))
        expect(Maybe.concat(Maybe.Nothing, Maybe.Just([1,2,3]))).toEqual(Maybe.Just([1,2,3]))
        expect(Maybe.concat(Maybe.Nothing, Maybe.Nothing)).toEqual(Maybe.Nothing)
        tsst(() => { Maybe.concat(Maybe.Just(5), Maybe.Nothing) }).expectToFailWith('is not assignable to parameter of type')
    })

    it('reduce', () => {
        expect(Maybe.reduce(x => x + 1, 2, Maybe.Just(5))).toBe(6)
        expect(Maybe.reduce(x => x + 1, 2, Maybe.Nothing)).toBe(3)
    })

    it('extract', () => {
        tsst(() => {
            const a: number | null = Maybe.extract(Maybe.Just(5))
            const b: number | null = Maybe.extract(Maybe.Nothing)
        }).expectToCompile()
    })

    it('encase', () => {
        expect(Maybe.encase(() => { throw new Error('a') })).toBe(Maybe.Nothing)
        expect(Maybe.encase(() => 10)).toBe(Maybe.Just(10))
    })

    it('toEither', () => {
        expect(Maybe.toEither(5, Maybe.Just(10))).toEqual(Either.Right(10))
        expect(Maybe.toEither(5, Maybe.Nothing)).toEqual(Either.Left(5))
    })

    it('unsafeCoerce', () => {
        expect(Maybe.unsafeCoerce(Maybe.Just(5))).toEqual(5)
        expect(() => Maybe.unsafeCoerce(Maybe.Nothing)).toThrow()
        tsst(() => { const a: number = Maybe.unsafeCoerce(Maybe.Just(5)) }).expectToCompile()
    })
})