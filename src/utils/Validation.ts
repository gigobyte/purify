import { Either, Left, Right } from '../adts/Either'
import { Tuple } from '../adts/Tuple'
import { Maybe, Just, Nothing } from '../adts/Maybe'

type Validator<T> = (value: T) => boolean
type ValidationTuple<T, Err> = [Validator<T>, Err]

export abstract class Validate {
    static all<T, Err>(value: T, validations: ValidationTuple<T, Err>[]): Either<Err[], T> {
        const results = Maybe.catMaybes(validations.map(x => x[0](value) ? Nothing : Just(x[1])))

        return results.length > 0 ? Left(results) : Right(value)
    }

    static untilError<T, Err>(value: T, validations: ValidationTuple<T, Err>[]): Either<Err, T> {
        const error = validations.find(x => !x[0](value));

        return error ? Left(error[1]) : Right(value)
    }
}

export const ifEmpty = (value: string) => !!value.trim()
export const ifJust = <T>(value: Maybe<T>) => value.isNothing()
export const ifNothing = <T>(value: Maybe<T>) => value.isJust()
export const ifShorterThan = (length: number) => (value: string) => value.length > length
export const ifLongerThan = (length: number) => (value: string) => value.length < length
export const ifLengthIs = (length: number) => (value: string) => value.length !== length
export const ifSubstringOf = (str: string) => (value: string) => !str.includes(value)
export const ifContains = (substr: string) => (value: string) => !value.includes(substr)
export const ifEmptyList = <T>(arr: ArrayLike<T>) => arr.length > 0
export const ifEqualTo = <T>(other: T) => (value: T) => value !== other
export const ifTrue = <T>(condition: Validator<T>) => (value: T) => !condition(value)
export const ifFalse = <T>(condition: Validator<T>) => (value: T) => condition(value)

export const not = <T>(validation: Validator<T>): Validator<T> => (value: T) => !validation(value)
export const or = <T>(validation1: Validator<T>, validation2: Validator<T>): Validator<T> => (value: T) => validation1(value) || validation2(value)
export const and = <T>(validation1: Validator<T>, validation2: Validator<T>): Validator<T> => (value: T) => validation1(value) && validation2(value)