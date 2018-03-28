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

    it('Should OR booleans', () => {
        expect(concat(true,false)).toEqual(true)
        expect(concat(true,true)).toEqual(true)
        expect(concat(false,true)).toEqual(true)
        expect(concat(false,false)).toEqual(false)
    })
})