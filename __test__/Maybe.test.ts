import * as Maybe from '../src/Maybe'

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
        expect(Maybe.ap(Maybe.Just(x => x + 1), Maybe.Just(5))).toBe(Maybe.Just(6))
        expect(Maybe.ap(Maybe.Nothing, Maybe.Just(5))).toBe(Maybe.Nothing)
        expect(Maybe.ap(Maybe.Just(x => x + 1), Maybe.Nothing)).toBe(Maybe.Nothing)
        expect(Maybe.ap(Maybe.Nothing, Maybe.Nothing)).toBe(Maybe.Nothing)
    })
})