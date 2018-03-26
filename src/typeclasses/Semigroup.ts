export default interface Semigroup<T extends Semigroup<T>> {
    concat(other: T): T
    'fantasy-land/concat'?: Semigroup<T>['concat']
}

function concat<T>(a: T, b: T): T
function concat<T>(a: T[], b: T[]): T[]
function concat(a: number, b: number): number
function concat(a: string, b: string): string
function concat(a: boolean, b: boolean): boolean
function concat<T extends Semigroup<any>>(a: T, b: T): T
function concat(a: any, b: any): any {
    if (typeof a.concat === 'function' && typeof b.concat === 'function') {
        return a.concat(b)
    }

    if (typeof a === 'number' && typeof b === 'number') {
        return a + b
    }

    if (typeof a === 'string' && typeof b === 'string') {
        return a + b
    }

    if (typeof a === 'boolean' && typeof b === 'boolean') {
        return a || b
    }
}

export { concat }