import * as List from './List'
import { Just, Nothing } from '../adts/Maybe'
import { Tuple } from '../adts/Tuple'

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
})
