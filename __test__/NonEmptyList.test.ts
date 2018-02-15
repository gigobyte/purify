import { NonEmptyList } from '../src/NonEmptyList'
import { tsst } from 'tsst-tycho'

describe('NonEmptyList', () => {
    it('Assigning native arrays with elements', () => {
        const arr: [1,2,3] = [1,2,3]

        tsst(() => {
            const arr2: NonEmptyList<number> = arr
        }).expectToCompile()
    })

    it('Assigning empty native arrays should fail', () => {
        tsst(() => {
            const arr: NonEmptyList<any> = []
        }).expectToFailWith(`not assignable to type 'NonEmptyList<any>'.`)
    })
})