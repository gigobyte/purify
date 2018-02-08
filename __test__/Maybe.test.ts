import * as Maybe from '../src/Maybe'
import { identity, compose } from 'ramda';

describe('Constructor methods', () => {
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
})

describe('Maybe as a Functor', () => {
    it('Functors must preserve identity morphisms', () => {
        expect(Maybe.map(identity, 5)).toBe(5);
    })

    it('Functors preserve composition of morphisms', () => {
        const f = x => x + 1
        const g = x => x + 2

        expect(Maybe.lift(compose(f, g))(5)).toBe(compose(Maybe.lift(f), Maybe.lift(g))(5))
    })
})