import { Validate } from './Validation'
import { Left, Right } from 'adts/Either'
import * as V from './Validation'

const err1 = 'Username shouldnt contain 1';
const err2 = 'Username shouldnt contain digits';

const validateUsername = (username: string) => Validate.all(username, [
    [V.ifContains('1'), err1],
    [V.ifSubstringOf('1234567'), err2]
])

const validateUsername2 = (username: string) => Validate.untilError(username, [
    [V.ifContains('1'), err1],
    [V.ifSubstringOf('1234567'), err2]
])

describe('Validation', () => {
    test('all', () => {
        expect(validateUsername('123')).toEqual(Left([err1, err2]))
    })

    test('untilError', () => {
        expect(validateUsername2('123')).toEqual(Left(err1))
    })
})