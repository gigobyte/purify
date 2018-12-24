import { Id } from './Id'

describe('Id', () => {
  test('of', () => {
    expect(Id.of(5)).toEqual(Id(5))
  })

  test('extract', () => {
    expect(Id(5).extract()).toEqual(5)
  })

  test('map', () => {
    expect(Id(5).map(x => x + 1)).toEqual(Id(6))
  })

  test('chain', () => {
    expect(Id(5).chain(x => Id(x + 1))).toEqual(Id(6))
  })

  test('ap', () => {
    expect(Id(5).ap(Id((x: number) => x + 1))).toEqual(Id(6))
  })

  test('equals', () => {
    expect(Id(5).equals(Id(5))).toEqual(true)
    expect(Id(5).equals(Id(0))).toEqual(false)
  })
})
