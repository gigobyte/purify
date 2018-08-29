import concat from './concat'

describe('concat', () => {
    it('Should add numbers', () => {
        expect(concat(1,2)).toEqual(3)
    })

    it('Should concatenate string', () => {
        expect(concat('a','b')).toEqual('ab')
    })

    it('Should concatenate Semigroup objects', () => {
        expect(concat([1,2],[3,4])).toEqual([1,2,3,4])
    })
})