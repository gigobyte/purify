import * as List from './List'
import { Just, Nothing } from './Maybe'
import { Tuple } from './Tuple'

describe('List', () => {
  test('at', () => {
    expect(List.at(0, [1, 2])).toEqualStringified(Just(1))
    expect(List.at(0)([1, 2])).toEqualStringified(Just(1))
    expect(List.at(0, [1, 2])).toEqualStringified(Just(1))
    expect(List.at(0, [])).toEqualStringified(Nothing)
  })

  test('head', () => {
    expect(List.head([1])).toEqualStringified(Just(1))
    expect(List.head([])).toEqualStringified(Nothing)
  })

  test('last', () => {
    expect(List.last([1, 2, 3])).toEqualStringified(Just(3))
    expect(List.last([])).toEqualStringified(Nothing)
  })

  test('tail', () => {
    expect(List.tail([1, 2, 3])).toEqualStringified(Just([2, 3]))
    expect(List.tail([1])).toEqualStringified(Just([]))
    expect(List.tail([])).toEqualStringified(Nothing)
  })

  test('init', () => {
    expect(List.init([1, 2, 3])).toEqualStringified(Just([1, 2]))
    expect(List.init([1])).toEqualStringified(Just([]))
    expect(List.init([])).toEqualStringified(Nothing)
  })

  test('uncons', () => {
    expect(List.uncons([])).toEqualStringified(Nothing)
    expect(List.uncons([1])).toEqualStringified(Just(Tuple(1, [])))
    expect(List.uncons([1, 2])).toEqualStringified(Just(Tuple(1, [2])))
    expect(List.uncons([1, 2, 3])).toEqualStringified(Just(Tuple(1, [2, 3])))
  })
})
