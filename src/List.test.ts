import { List } from './List'
import { Just, Nothing } from './Maybe'
import { Tuple } from './Tuple'
import { compare } from './Function'

describe('List', () => {
  test('at', () => {
    expect(List.at(0, [1, 2])).toEqual(Just(1))
    expect(List.at(0)([1, 2])).toEqual(Just(1))
    expect(List.at(0, [1, 2])).toEqual(Just(1))
    expect(List.at(0, [])).toEqual(Nothing)
  })

  test('head', () => {
    expect(List.head([1])).toEqual(Just(1))
    expect(List.head([])).toEqual(Nothing)
  })

  test('last', () => {
    expect(List.last([1, 2, 3])).toEqual(Just(3))
    expect(List.last([])).toEqual(Nothing)
  })

  test('tail', () => {
    expect(List.tail([1, 2, 3])).toEqual(Just([2, 3]))
    expect(List.tail([1])).toEqual(Just([]))
    expect(List.tail([])).toEqual(Nothing)
  })

  test('init', () => {
    expect(List.init([1, 2, 3])).toEqual(Just([1, 2]))
    expect(List.init([1])).toEqual(Just([]))
    expect(List.init([])).toEqual(Nothing)
  })

  test('uncons', () => {
    expect(List.uncons([])).toEqual(Nothing)
    expect(List.uncons([1])).toEqual(Just(Tuple(1, [])))
    expect(List.uncons([1, 2])).toEqual(Just(Tuple(1, [2])))
    expect(List.uncons([1, 2, 3])).toEqual(Just(Tuple(1, [2, 3])))
  })

  test('sum', () => {
    expect(List.sum([])).toEqual(0)
    expect(List.sum([1, 2, 3])).toEqual(6)
  })

  test('find', () => {
    expect(List.find((x) => x == 5)([1, 2, 3, 5])).toEqual(Just(5))
    expect(List.find((x) => x == 5, [1, 2, 3, 5])).toEqual(Just(5))
    expect(List.find((x) => x == 0, [1, 2, 3, 5])).toEqual(Nothing)
  })

  test('findIndex', () => {
    expect(List.findIndex((x) => x == 5)([1, 2, 3, 5])).toEqual(Just(3))
    expect(List.findIndex((x) => x == 5, [1, 2, 3, 5])).toEqual(Just(3))
    expect(List.findIndex((x) => x == 0, [1, 2, 3, 5])).toEqual(Nothing)
  })

  test('sort', () => {
    const arr = [4, 3, 1000, 0]

    expect(List.sort(compare, arr)).toEqual([0, 3, 4, 1000])
    expect(List.sort(compare)(arr)).toEqual([0, 3, 4, 1000])
    // immutability check
    expect(List.sort(compare, arr)).not.toBe(arr)
  })
})
