import { tsst } from 'tsst-tycho'
import * as Tuple from '../src/Tuple'

describe('Tuple', () => {
    it('Tuple', () => {
        expect(Tuple.Tuple(1,2)).toEqual([1,2])
        expect(Tuple.Tuple(1,'str')).toEqual([1,'str'])
    })

    it('fst', () => {
        expect(Tuple.fst(Tuple.Tuple(1,2))).toEqual(1)
    })

    it('snd', () => {
        expect(Tuple.snd(Tuple.Tuple(1,2))).toEqual(2)
    })

    it('bimap', () => {
        expect(Tuple.bimap(x => x + 1, x => x + '!', Tuple.Tuple(5, 'Message'))).toEqual(Tuple.Tuple(6, 'Message!'))
    })

    it('mapFirst', () => {
        expect(Tuple.mapFirst(x => x + 1, Tuple.Tuple(5, 'Message'))).toEqual(Tuple.Tuple(6, 'Message'))
    })

    it('mapSecond', () => {
        expect(Tuple.mapSecond(x => x + '!', Tuple.Tuple(5, 'Message'))).toEqual(Tuple.Tuple(5, 'Message!'))
    })

    it('lift', () => {
        expect(Tuple.lift((x: number) => x + 1, x => x + '!')(Tuple.Tuple(5, 'Message'))).toEqual(Tuple.Tuple(6, 'Message!'))
    })

    it('liftFirst', () => {
        expect(Tuple.liftFirst((x: number) => x + 1)(Tuple.Tuple(5, 'Message'))).toEqual(Tuple.Tuple(6, 'Message'))
    })

    it('liftSecond', () => {
        expect(Tuple.liftSecond(x => x + '!')(Tuple.Tuple(5, 'Message'))).toEqual(Tuple.Tuple(5, 'Message!'))
    })

    it('equals', () => {
        expect(Tuple.equals(Tuple.Tuple(5, 'Msg'), Tuple.Tuple(5, 'Msg'))).toBe(true)
        expect(Tuple.equals(Tuple.Tuple(5, 'Msg'), Tuple.Tuple(5, 'Message'))).toBe(false)
        expect(Tuple.equals(Tuple.Tuple(10, 'Msg'), Tuple.Tuple(5, 'Msg'))).toBe(false)
        expect(Tuple.equals(Tuple.Tuple(10, 'Msg'), Tuple.Tuple(5, 'Message'))).toBe(false)
    })

    it('fromArray', () => {
        const test = (_: Tuple.Tuple<number, string>) => {}

        tsst(() => { test([1, 'Msg']) }).expectToFailWith('is not assignable to parameter of type')
        tsst(() => { test(Tuple.fromArray([1, 'Msg',])) }).expectToCompile()
        tsst(() => { test(Tuple.fromArray([1, 'Msg', 'Three'])) }).expectToFailWith('is not assignable to parameter of type')
    })

    it('swap', () => {
        expect(Tuple.swap(Tuple.swap(Tuple.Tuple('Message', 1)))).toEqual(Tuple.Tuple('Message', 1))
    })
})