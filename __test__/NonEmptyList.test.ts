import { NonEmptyList, isNonEmpty } from '../src/NonEmptyList'
import { tsst } from 'tsst-tycho'

describe('NonEmptyList: constructor and typecasts', () => {
    it('Typecasting empty native arrays to NonEmptyList should fail', () => {
        tsst(() => {
            const arr: NonEmptyList<any> = []
        }).expectToFailWith(`not assignable to type 'NonEmptyList<any>'`)
    })

    it('Typecasting unknown length native array to NonEmptyList should fail', () => {
        tsst(() => {
            const unkwn = [1,2,3]
            const arr: NonEmptyList<number> = unkwn
        }).expectToFailWith(`not assignable to type 'NonEmptyList<number>'`)
    })

    it('Using constructor with empty array should fail', () => {
        tsst(() => {
            const arr = NonEmptyList([])
        }).expectToFailWith(`not assignable to parameter of type 'ArrayWithOneElement`)
    })

    it('Using constructor should not treat object properties as array properties', () => {
        tsst(() => {
            type Obj = {a: number, b: number}
            const a: [Obj] = [{a: 5, b: 5}]

            const arr = NonEmptyList(a)

            arr.a
            arr.b
        }).expectToFailWith(`does not exist on type`)
    })

    it('Typecasting native arrays with elements to NonEmptyList should compile', () => {
        const arr: [1, 2, 3] = [1, 2, 3]

        tsst(() => {
            const arr2: NonEmptyList<number> = arr
        }).expectToCompile()
    })

    it('Using constructor with non-empty array argument should compile', () => {
        tsst(() => {
            const arr = NonEmptyList([5])
        }).expectToCompile()
    })

    it('Using constructor should result in the right type', () => {
        tsst(() => {
            const arr: NonEmptyList<number> = NonEmptyList([5])
        }).expectToCompile()
    })

    it('Constructor should preserve array properties', () => {
        tsst(() => {
            const arr = NonEmptyList([5])

            arr.map
            arr.includes
            arr[0]
        }).expectToCompile()
    })

    it('Typecasting should support native arrays up to 10 elements', () => {
        tsst(() => {
            const a: NonEmptyList<number> = [1]
            const a2: NonEmptyList<number> = [1, 2]
            const a3: NonEmptyList<number> = [1, 2, 3]
            const a4: NonEmptyList<number> = [1, 2, 3, 4]
            const a5: NonEmptyList<number> = [1, 2, 3, 4, 5]
            const a6: NonEmptyList<number> = [1, 2, 3, 4, 5, 6]
            const a7: NonEmptyList<number> = [1, 2, 3, 4, 5, 6, 7]
            const a8: NonEmptyList<number> = [1, 2, 3, 4, 5, 6, 7, 8]
            const a9: NonEmptyList<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9]
            const a10: NonEmptyList<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        }).expectToCompile()
    })

    it('Typecasting should fail for arrays with more than 10 elements', () => {
        tsst(() => {
            const a11: NonEmptyList<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
        }).expectToFailWith(`is not assignable to type`)
    })

    it('Constructor should work for native arrays with more than 10 elements', () => {
        tsst(() => {
            const a11: NonEmptyList<number> = NonEmptyList([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
        }).expectToCompile()
    })
})

describe('NonEmptyList: type predicate', () => {
    it('Should return true for arrays with elements', () => {
        expect(isNonEmpty([1])).toBe(true)
    })

    it('Should return false for empty arrays', () => {
        expect(isNonEmpty([])).toBe(false)
    })

    it('Should return true for NonEmptyList', () => {
        expect(isNonEmpty(NonEmptyList([5]))).toBe(true)
    })
})