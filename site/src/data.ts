export interface MethodExample {
    input: string,
    output: string
}

export interface Method {
    name: string,
    description: string,
    signatureML?: string,
    signatureTS?: string,
    examples: MethodExample[]
}

export interface DataType {
    name: string,
    implements: string[],
    description: string,
    example: string[],
    constructors: Method[],
    staticMethods: Method[],
    instanceMethods: Method[]
}

export interface Typeclass {
    name: string
}

export interface Data {
    datatypes: DataType[],
    typeclasses: Typeclass[]
}

const data: Data = {
    datatypes: [
        {
            name: 'Maybe',
            implements: ['Setoid', 'Ord', 'Semigroup', 'Monoid', 'Functor', 'Apply', 'Applicative', 'Alt', 'Plus', 'Alternative', 'Chain', 'Monad', 'Foldable', 'Extend', 'Unsafe'],
            description: `The Maybe type is one of the most popular data types available. It is fundamental to learning about functional error handling and representing missing values. A Maybe value can be either Just a value or Nothing. The Just data constructor is used for wrapping present values while the Nothing constructor is used when a value is absent. Both constructors share the same API which makes it easy to manipulate optional values without null checking or exception handling.`,
            example: [
                `import { Maybe } from 'pure-ts/adts/Maybe'`,
                '',
                '// Without Maybe',
                'let port: number',
                'let config: Config | null = getConfig()',
                '',
                'if (config && config.port) {',
                '    port = parseInt(config.port)',
                '} else {',
                '    port = 8080',
                '}',
                '',
                '// With Maybe',
                'const config: Maybe<Config> = getConfig()',
                'const port: number = config.chain(x => x.port).map(parseInt).orDefault(8080)'
            ],
            constructors: [
                {
                    name: 'Just',
                    description: 'Constructs a Just',
                    signatureML: 'a → Maybe a',
                    signatureTS: '<T>(value: T): Maybe<T>',
                    examples: [
                        {input: 'Just(10)', output: 'Just(10) // Maybe<number>'}
                    ]
                },
                {
                    name: 'Nothing',
                    description: 'Exported Nothing',
                    examples: [
                        {input: 'Nothing', output: 'Nothing // Maybe<never>'}
                    ]
                }
            ],
            staticMethods: [
                {
                    name: 'of',
                    signatureML: 'a → Maybe a',
                    signatureTS: '<T>(value: T): Maybe<T>',
                    description: 'Takes a value and wraps it in a `Just`',
                    examples: [
                        {input: 'Maybe.of(10)', output: 'Just(10)'}
                    ]
                },
                {
                    name: 'empty',
                    signatureML: '() → Maybe a',
                    signatureTS: '(): Maybe<never>',
                    description: 'Returns `Nothing`',
                    examples: [
                        {input: 'Maybe.empty()', output: 'Nothing'}
                    ]
                },
                {
                    name: 'zero',
                    signatureML: '() → Maybe a',
                    signatureTS: '(): Maybe<never>',
                    description: 'Returns `Nothing`',
                    examples: [
                        {input: 'Maybe.zero()', output: 'Nothing'}
                    ]
                },
                {
                    name: 'toMaybe',
                    signatureTS: '<T>(value?: T): Maybe<T>',
                    description: 'Takes a value and returns `Nothing` if the value is null or undefined, otherwise a `Just` is returned',
                    examples: [
                        {input: 'Maybe.toMaybe(null)', output: 'Nothing'},
                        {input: 'Maybe.toMaybe(10)', output: 'Just(10)'},
                    ]
                },
                {
                    name: 'toMaybeWeak',
                    signatureTS: '<T>(value?: T): Maybe<T>',
                    description: 'Takes a value and returns Nothing if the value is falsy, otherwise a Just is returned',
                    examples: [
                        {input: `Maybe.toMaybeWeak('')`, output: 'Nothing'},
                        {input: 'Maybe.toMaybeWeak(0)', output: 'Nothing'},
                    ]
                },
                {
                    name: 'catMaybes',
                    signatureML: '[Maybe a] -> [a]',
                    signatureTS: '<T>(list: Maybe<T>[]): T[]',
                    description: 'Returns only the `Just` values in a list',
                    examples: [
                        {input: 'Maybe.catMaybes([Just(5), Nothing, Just(10)])', output: '[5, 10]'}
                    ]
                },
                {
                    name: 'mapMaybe',
                    signatureML: '(a -> Maybe b) -> [a] -> [b]',
                    signatureTS: '<T, U>(f: (value: T) => Maybe<U>, list: T[]): U[]',
                    description: 'Maps over a list of values and returns a list of all resulting `Just` values',
                    examples: [
                        {input: 'Maybe.mapMaybe(x => x > 5 ? Just(x) : Nothing, [1, 2, 3, 7, 8, 9])', output: '[7, 8, 9]'}
                    ]
                },
                {
                    name: 'encase',
                    signatureTS: '<T>(throwsF: () => T): Maybe<T>',
                    description: 'Calls a function that may throw and wraps the result in a `Just` if successful or `Nothing` if an error is caught',
                    examples: [
                        {input: `Maybe.encase(() => { throw new Error('a') })`, output: 'Nothing'},
                        {input: `Maybe.encase(() => 10)`, output: 'Just(10)'}
                    ]
                }
            ],
            instanceMethods: [
                {
                    name: 'isJust',
                    signatureML: 'Maybe a ~> Bool',
                    signatureTS: '(): boolean',
                    description: 'Returns true if `this` is `Just`, otherwise it returns false',
                    examples: [
                        {input: 'Just(5).isJust()', output: 'true'},
                        {input: 'Nothing.isJust()', output: 'false'}
                    ]
                },
                {
                    name: 'isNothing',
                    signatureML: 'Maybe a ~> Bool',
                    signatureTS: '(): this is Maybe<never>',
                    description: 'Returns true if `this` is `Nothing`, otherwise it returns false',
                    examples: [
                        {input: 'Just(5).isJust()', output: 'false'},
                        {input: 'Nothing.isJust()', output: 'true'}
                    ]
                },
                {
                    name: 'caseOf',
                    signatureTS: '<U>(patterns: {Just: (value: T) => U, Nothing: () => U}): U',
                    description: 'Structural pattern matching for `Maybe` in the form of a function',
                    examples: [
                        {input: 'Just(5).caseOf({ Just: x => x + 1, Nothing: () => 0 })', output: '6'},
                        {input: 'Nothing.caseOf({ Just: x => x + 1, Nothing: () => 0 })', output: '0'}
                    ]
                },
                {
                    name: 'equals',
                    signatureML: 'Maybe a ~> Maybe a -⁠> Bool',
                    signatureTS: '(other: Maybe<T>): boolean',
                    description: 'Compares the values inside `this` and the argument, returns true if both are Nothing or if the values are equal',
                    examples: [
                        {input: 'Just(5).equals(Just(5))', output: 'true'},
                        {input: 'Just(5).equals(Just(10))', output: 'false'},
                        {input: 'Just(5).equals(Nothing)', output: 'false'}
                    ]
                },
                {
                    name: 'lte',
                    signatureML: 'Maybe a ~> Maybe a -⁠> Boolean',
                    signatureTS: '(other: Maybe<T>): boolean',
                    description: 'Compares the values inside `this` and the argument, returns true if `this` is Nothing or if the value inside `this` is less than or equal to the value of the argument',
                    examples: [
                        {input: 'Just(5).lte(Just(10))', output: 'true'},
                        {input: 'Just(5).lte(Just(0))', output: 'false'},
                        {input: 'Just(5).lte(Nothing)', output: 'false'},
                        {input: 'Nothing.lte(Just(5))', output: 'true'},
                        {input: 'Nothing.lte(Nothing)', output: 'true'}
                    ]
                },
                {
                    name: 'concat',
                    signatureML: 'Maybe a ~> Maybe a -⁠> Maybe a',
                    signatureTS: '(other: Maybe<T>): Maybe<T>',
                    description: 'Concatenates a value inside a `Maybe` to the value inside `this`',
                    examples: [
                        {input: 'Just([1,2,3]).concat(Just([7,8,9]))', output: 'Just([1,2,3,7,8,9])'},
                        {input: `Just('Some string').concat(Just('!'))`, output: `Just('Some string!')`},
                        {input: 'Nothing.concat(Just([1,2,3]))', output: 'Just([1,2,3])'},
                        {input: 'Just([1,2,3]).concat(Nothing)', output: 'Just([1,2,3])'},
                        {input: 'Nothing.concat(Nothing)', output: 'Nothing'}
                    ]
                },
                {
                    name: 'map',
                    signatureML: 'Maybe a ~> (a -⁠> b) -⁠> Maybe b',
                    signatureTS: '<U>(f: (value: T) => U): Maybe<U>',
                    description: 'Transforms the value inside `this` with a given function. Returns `Nothing` if `this` is `Nothing`',
                    examples: [
                        {input: 'Just(5).map(x => x + 1)', output: 'Just(6)'},
                        {input: 'Nothing.map(x => x + 1)', output: 'Nothing'}
                    ]
                },
                {
                    name: 'ap',
                    signatureML: 'Maybe a ~> Maybe (a -⁠> b) -⁠> Maybe b',
                    signatureTS: '<U>(maybeF: Maybe<(value: T) => U>): Maybe<U>',
                    description: 'Maps `this` with a `Maybe` function',
                    examples: [
                        {input: 'Just(5).ap(Just(x => x + 1))', output: 'Just(6)'},
                        {input: 'Just(5).ap(Nothing)', output: 'Nothing'},
                        {input: 'Nothing.ap(Just(x => x + 1))', output: 'Nothing'},
                        {input: 'Nothing.ap(Nothing)', output: 'Nothing'}
                    ]
                },
                {
                    name: 'alt',
                    signatureML: 'Maybe a ~> Maybe a -⁠> Maybe a',
                    signatureTS: '(other: Maybe<T>): Maybe<T>',
                    description: 'Returns the first `Just` between `this` and another `Maybe` or `Nothing` if both `this` and the argument are `Nothing`',
                    examples: [
                        {input: 'Just(5).alt(Just(6))', output: 'Just(5)'},
                        {input: 'Just(5).alt(Nothing)', output: 'Just(5)'},
                        {input: 'Nothing.alt(Just(5))', output: 'Just(5)'},
                        {input: 'Nothing.alt(Nothing)', output: 'Nothing'}
                    ]
                },
                {
                    name: 'chain',
                    signatureML: 'Maybe a ~> (a -⁠> Maybe b) -⁠> Maybe b',
                    signatureTS: '<U>(f: (value: T) => Maybe<U>): Maybe<U>',
                    description: 'Transforms `this` with a function that returns a `Maybe`. Useful for chaining many computations that may fail',
                    examples: [
                        {input: 'Just(5).chain(x => Just(x + 1))', output: 'Just(6)'},
                        {input: 'Nothing.chain(x => Just(x + 1))', output: 'Nothing'}
                    ]
                },
                {
                    name: 'reduce',
                    signatureML: 'Maybe a ~> ((b, a) -⁠> b, b) -⁠> b',
                    signatureTS: '<U>(reducer: (accumulator: U, value: T) => U, initialValue: U): U',
                    description: 'Takes a reducer and a initial value and returns the initial value if `this` is `Nothing` or the result of applying the function to the initial value and the value inside `this`',
                    examples: [
                        {input: 'Just(5).reduce((acc, x) => x * acc, 2)', output: '10'},
                        {input: 'Nothing.reduce((acc, x) => x * acc, 0)', output: '0'},
                    ]
                },
                {
                    name: 'extend',
                    signatureML: 'Maybe a ~> (Maybe a -⁠> b) -⁠> Maybe b',
                    signatureTS: '<U>(f: (value: Maybe<T>) => U): Maybe<U>',
                    description: 'Returns `this` if it\'s `Nothing`, otherwise it returns the result of applying the function argument to `this` and wrapping it in a `Just`',
                    examples: [
                        {input: 'Just(5).extend(x => x.isJust())', output: 'Just(true)'},
                        {input: 'Nothing.extend(x => x.isJust())', output: 'Nothing'}
                    ]
                },
                {
                    name: 'unsafeCoerce',
                    signatureML: 'Maybe a ~> a ',
                    signatureTS: '(): T',
                    description: 'Returns the value inside `this` or throws an error if `this` is `Nothing`',
                    examples: [
                        {input: 'Just(5).unsafeCoerce()', output: '5'},
                        {input: 'Nothing.unsafeCoerce()', output: '// Error: Maybe got coerced to a null'}
                    ]
                },
                {
                    name: 'orDefault',
                    signatureML: 'Maybe a ~ a -> a',
                    signatureTS: '(defaultValue: T): T',
                    description: 'Returns the default value if `this` is `Nothing`, otherwise it unwraps `this` and returns the value',
                    examples: [
                        {input: 'Just(5).orDefault(0)', output: '5'},
                        {input: 'Nothing.orDefault(0)', output: '0'}
                    ]
                },
                {
                    name: 'mapOrDefault',
                    signatureML: 'Maybe a ~> (a -> b) -> b -> b',
                    signatureTS: '<U>(f: (value: T) => U, defaultValue: U): U',
                    description: 'Maps over `this` and returns the resulting value or returns the default value if `this` is `Nothing`',
                    examples: [
                        {input: 'Just(5).mapOrDefault(x => x + 1, 0)', output: '6'},
                        {input: 'Nothing.mapOrDefault(x => x + 1, 0)', output: '0'}
                    ]
                },
                {
                    name: 'extract',
                    signatureTS: '(): T | null',
                    description: 'Returns the value inside `this` or null if `this` is `Nothing`',
                    examples: [
                        {input: 'Just(5).extract()', output: '5'},
                        {input: 'Nothing.extract()', output: 'null'}
                    ]
                },
                {
                    name: 'toList',
                    signatureML: 'Maybe a ~> [a]',
                    signatureTS: '(): T[]',
                    description: 'Returns empty list if the `Maybe` is `Nothing` or a list where the only element is the value of `Just`',
                    examples: [
                        {input: 'Just(5).toList()', output: '[5]'},
                        {input: 'Nothing.toList()', output: '[]'}
                    ]
                },
                {
                    name: 'toEither',
                    signatureML: 'Maybe a ~> e -> Either e a',
                    signatureTS: '<L>(left: L): Either<L, T>',
                    description: 'Constructs a `Right` from a `Just` or a `Left` with a provided left value if `this` is `Nothing`',
                    examples: [
                        {input: `Just(5).toEither('Error')`, output: 'Right(5)'},
                        {input: `Nothing.toEither('Error')`, output: `Left('Error')`}
                    ]
                },
                {
                    name: 'ifJust',
                    signatureTS: '(effect: (value: T) => any): this',
                    description: 'Runs an effect if `this` is `Just`, returns `this` for easier composiblity',
                    examples: [
                        {input: `Just(5).ifJust(() => console.log('success'))`, output: `// success`},
                        {input: `Nothing.ifJust(() => console.log('success'))`, output: ''}
                    ]
                },
                {
                    name: 'ifNothing',
                    signatureTS: '(effect: (value: T) => any): this',
                    description: 'Runs an effect if `this` is `Nothing`, returns `this` for easier composiblity',
                    examples: [
                        {input: `Just(5).ifNothing(() => console.log('failure'))`, output: ''},
                        {input: `Nothing.ifNothing(() => console.log('failure'))`, output: '// failure'}
                    ]
                }
            ]
        },
        {
            name: 'Either',
            implements: ['Setoid', 'Ord', 'Semigroup', 'Functor', 'Apply', 'Applicative', 'Alt', 'Chain', 'Monad', 'Foldable', 'Extend', 'Bifunctor', 'Unsafe'],
            description: `Either is a data type with two sides (constructors) - Left and Right. It is most commonly used for error handling as it is very similar to the Maybe type with the only difference being that you can store information about the missing value (an error message for example). By convention, "Right is right", meaning that success is stored on the Right and failure is stored on the Left. It is also important to note that Either is right-biased which means that \`map\`, \`chain\` and other similar methods will operate on the right side.`,
            example: [
                `import { Either, Left, Right } from 'pure-ts/adts/Either'`,
                '',
                '// Without Either',
                'const getPort = () => {',
                '    const config: Config | null = getConfig()',
                '',
                '    if (config && config.port) {',
                '        return parseInt(config.port)',
                '    }',
                '',
                `    throw new Error("Couldn't parse port from config")`,
                '}',
                '',
                'let port: number',
                '',
                'try {',
                '    port = getPort()',
                '} catch (e) {',
                '    loggingService.log(e.message)',
                '    port = 8080',
                '}',
                '',
                '',
                '// With Either',
                'const getPort = () => {',
                '    const config: Config | null = getConfig()',
                '',
                '    if (config && config.port) {',
                '        return Right(parseInt(config.port))',
                '    }',
                '',
                `    return Left(new Error("Couldn't parse port from config"))`,
                '}',
                '',
                'const port: number = getPort().ifLeft((e) => loggingService.log(e.message)).orDefault(8080)'
            ],
            constructors: [
                {
                    name: 'Left',
                    description: 'Constructs a Left',
                    signatureML: 'a → Either a b',
                    signatureTS: '<L>(value: L): Either<L, never>',
                    examples: [
                        {input: `Left('Error')`, output: `Left('Error') // Either<string, never>`}
                    ]
                },
                {
                    name: 'Right',
                    description: 'Constructs a Right',
                    signatureML: 'b -> Either a b',
                    signatureTS: '<R>(value: R): Either<never, R>',
                    examples: [
                        {input: 'Right(10)', output: 'Right(10) // Either<never, number>'}
                    ]
                }
            ],
            staticMethods: [
                {
                    name: 'of',
                    description: 'Takes a value and wraps it in a `Right`',
                    signatureML: 'b -> Either a b',
                    signatureTS: '<R>(value: R): Either<never, R>',
                    examples: [
                        {input: 'Either.of(5)', output: 'Right(5)'}
                    ]
                },
                {
                    name: 'lefts',
                    description: 'Takes a list of eithers and returns a list of all `Left` values',
                    signatureML: '[Either a b] -> [a]',
                    signatureTS: '<L, R>(list: Either<L,R>[]): L[]',
                    examples: [
                        {input: `Either.lefts([Left('Error'), Left('Error2'), Right(5)])`, output: `['Error', 'Error2']`}
                    ]
                },
                {
                    name: 'rights',
                    description: 'Takes a list of eithers and returns a list of all `Right` values',
                    signatureML: '[Either a b] -> [b]',
                    signatureTS: '<L, R>(list: Either<L, R>[]): R[]',
                    examples: [
                        {input: `Either.rights([Right(10), Left('Error'), Right(5)])`, output: '[10, 5]'}
                    ]
                },
                {
                    name: 'encase',
                    description: 'Calls a function and returns a `Right` with the return value or an exception wrapped in a `Left` in case of failure',
                    signatureTS: '<L extends Error, R>(throwsF: () => R): Either<L, R>',
                    examples: [
                        {input: `Either.encase(() => { throw new Error('a') })`, output: `Left(new Error('a'))`},
                        {input: 'Either.encase(() => 10)', output: 'Right(10)'}
                    ]
                }
            ],
            instanceMethods: [
                {
                    name: 'isLeft',
                    description: 'Returns true if `this` is `Left`, otherwise it returns false',
                    signatureML: 'Either a b -> Bool',
                    signatureTS: '(): boolean',
                    examples: [
                        {input: `Left('Error').isLeft()`, output: 'true'},
                        {input: `Right(10).isLeft()`, output: 'false'}
                    ]
                },
                {
                    name: 'isRight',
                    description: 'Returns true if `this` is `Right`, otherwise it returns false',
                    signatureML: 'Either a b -> Bool',
                    signatureTS: '(): boolean',
                    examples: [
                        {input: `Left('Error').isRight()`, output: 'false'},
                        {input: `Right(10).isRight()`, output: 'true'}
                    ]
                },
                {
                    name: 'caseOf',
                    description: 'Structural pattern matching for `Either` in the form of a function',
                    signatureTS: '<T>(patterns: { Left: (l: L) => T, Right: (r: R) => T }): T',
                    examples: [
                        {input: `Left('Error').caseOf({ Left: x => x, Right: () => 'No error' })`, output: `'Error'`},
                        {input: `Right(6).caseOf({ Left: _ => 0, Right: x => x + 1 })`, output: '7'}
                    ]
                },
                {
                    name: 'bimap',
                    description: 'Given two functions, maps the value inside `this` using the first if `this` is `Left` or using the second one if `this` is `Right`. If both functions return the same type consider using `Either#either` instead',
                    signatureML: 'Either a b ~> (a -⁠> c, b -⁠> d) -⁠> Either c d',
                    signatureTS: '<L2, R2>(f: (value: L) => L2, g: (value: R) => R2): Either<L2, R2>',
                    examples: [
                        {input: `Left('Error').bimap(x => x + '!', x => x + 1)`, output: `Left('Error!')`},
                        {input: `Right(5).bimap(x => x + '!', x => x + 1)`, output: `Right(6)`}
                    ]
                },
                {
                    name: 'map',
                    description: 'Maps the `Right` value of `this`, acts like an identity if `this` is `Left`',
                    signatureML: 'Either a b ~> (b -⁠> c) -⁠> Either a c',
                    signatureTS: '<R2>(f: (value: R) => R2): Either<L, R2>',
                    examples: [
                        {input: `Left('Error').map(x => x + 1)`, output: `Left('Error')`},
                        {input: `Right(5).map(x => x + 1)`, output: `Right(6)`}
                    ]
                },
                {
                    name: 'mapLeft',
                    description: 'Maps the `Left` value of `this`, acts like an identity if `this` is `Right`',
                    signatureML: 'Either a b ~> (a -⁠> c) -⁠> Either c b',
                    signatureTS: '<L2>(f: (value: L) => L2): Either<L2, R>',
                    examples: [
                        {input: `Left('Error').mapLeft(x => x + '!')`, output: `Left('Error!')`},
                        {input: `Right(5).mapLeft(x => x + '!')`, output: `Right(5)`}
                    ]
                },
                {
                    name: 'ap',
                    description: 'Applies a `Right` function over a `Right` value. Returns `Left` if either `this` or the function are `Left`',
                    signatureML: 'Either a b ~> Either a (b -⁠> c) -⁠> Either a c',
                    signatureTS: '<R2>(other: Either<L, (value: R) => R2>): Either<L, R2>',
                    examples: [
                        {input: 'Right(5).ap(Right(x => x + 1))', output: 'Right(6)'},
                        {input: `Right(5).ap(Left('Error'))`, output: `Left('Error')`},
                        {input: `Left('Error').ap(Right(x => x + 1))`, output: `Left('Error')`},
                        {input: `Left('Error').ap(Left('Function Error'))`, output: `Left('Function Error')`},
                    ]
                },
                {
                    name: 'equals',
                    description: 'Compares `this` to another `Either`, returns false if the constructors or the values inside are different',
                    signatureML: 'Either a b ~> Either a b -⁠> Bool',
                    signatureTS: '(other: Either<L, R>): boolean',
                    examples: [
                        {input: `Left('Error').equals(Left('Error'))`, output: 'true'},
                        {input: `Right(5).equals(Right(5))`, output: 'true'},
                        {input: `Left(10).equals(Right(10))`, output: 'false'},
                        {input: `Right(5).equals(Left('Error'))`, output: 'false'},
                    ]
                },
                {
                    name: 'lte',
                    description: 'Compares `this` to another `Either`, returns false if the constructors are different or if the other `Either` is larger than `this`',
                    signatureML: 'Either a b ~> Either a b -⁠> Bool',
                    signatureTS: '(other: Either<L, R>): boolean',
                    examples: [
                        {input: 'Left(5).lte(Left(6))', output: 'true'},
                        {input: 'Right(5).lte(Left(6))', output: 'false'},
                        {input: 'Right(5).lte(Right(3))', output: 'false'},
                    ]
                },
                {
                    name: 'concat',
                    description: 'Concatenates a value inside an `Either` to the value inside `this`',
                    signatureML: 'Either a b ~> Either a b -⁠> Either a b',
                    signatureTS: '(other: Either<L, R>): Either<L, R>',
                    examples: [
                        {input: 'Right([1,2]).concat(Right([3,4]))', output: 'Right([1, 2, 3, 4])'},
                        {input: `Right([1,2]).concat(Left('Error'))`, output: 'Right([1, 2])'},
                        {input: `Left('Error').concat(Right([1, 2]))`, output: 'Right([1, 2])'},
                    ]
                },
                {
                    name: 'chain',
                    description: 'Transforms `this` with a function that returns an `Either`. Useful for chaining many computations that may fail',
                    signatureML: 'Either a b ~> (b -⁠> Either a c) -⁠> Either a c',
                    signatureTS: '<R2>(f: (value: R) => Either<L, R2>): Either<L, R2>',
                    examples: [
                        {input: `Left('Error').chain(x => Right(x + 1))`, output: `Left('Error')`},
                        {input: `Right(5).chain(x => Right(x + 1))`, output: `Right(6)`}
                    ]
                },
                {
                    name: 'alt',
                    description: 'Returns the first `Right` between `this` and another `Either` or the `Left` in the argument if both `this` and the argument are `Left`',
                    signatureML: 'Either a b ~> Either a b -⁠> Either a b',
                    signatureTS: 'other: Either<L, R>): Either<L, R>',
                    examples: [
                        {input: `Left('Error').alt(Left('Error!'))`, output: `Left('Error!')`},
                        {input: `Left('Error').alt(Right(5))`, output: `Right(5)`},
                        {input: `Right(5).alt(Left('Error'))`, output: `Right(5)`},
                        {input: `Right(5).alt(Right(6))`, output: `Right(5)`}
                    ]
                },
                {
                    name: 'reduce',
                    description: 'Takes a reducer and a initial value and returns the initial value if `this` is `Left` or the result of applying the function to the initial value and the value inside `this`',
                    signatureML: 'Either a b ~> ((c, b) -⁠> c, c) -⁠> c',
                    signatureTS: '<T>(reducer: (accumulator: T, value: R) => T, initialValue: T): T',
                    examples: [
                        {input: 'Right(5).reduce((acc, x) => x * acc, 2)', output: '10'},
                        {input: `Left('Error').reduce((acc, x) => x * acc, 0)`, output: '0'}
                    ]
                },
                {
                    name: 'extend',
                    description: 'Returns `this` if it\'s a `Left`, otherwise it returns the result of applying the function argument to `this` and wrapping it in a `Right`',
                    signatureML: 'Either a b ~> (Either a b -⁠> c) -⁠> Either a c',
                    signatureTS: '<R2>(f: (value: Either<L, R>) => R2): Either<L, R2>',
                    examples: [
                        {input: `Left('Error').extend(x => x.isRight())`, output: `Left('Error')`},
                        {input: `Right(5).extend(x => x.isRight())`, output: `Right(true)`}
                    ]
                },
                {
                    name: 'unsafeCoerce',
                    description: 'Returns the value inside `this` or throws an error if `this` is a `Left`',
                    signatureTS: '(): R',
                    examples: [
                        {input: 'Right(5).unsafeCoerce()', output: '5'},
                        {input: `Left('Error').unsafeCoerce()`, output: '// Either got coerced to a Left'}
                    ]
                },
                {
                    name: 'orDefault',
                    description: 'Returns the value inside `this` if it\'s `Right` or a default value if `this` is `Left`',
                    signatureML: 'Either a b ~> b -⁠> b',
                    signatureTS: '(defaultValue: R): R',
                    examples: [
                        {input: `Left('Error').orDefault(0)`, output: '0'},
                        {input: `Right(5).orDefault(0)`, output: '5'},
                    ]
                },
                {
                    name: 'leftOrDefault',
                    description: 'Returns the value inside `this` if it\'s `Left` or a default value if `this` is `Right`',
                    signatureML: 'Either a b ~> a -⁠> a',
                    signatureTS: '(defaultValue: L): L',
                    examples: [
                        {input: `Left('Error').leftOrDefault('No error')`, output: 'Error'},
                        {input: `Right(5).leftOrDefault('No error')`, output: 'No error'},
                    ]
                },
                {
                    name: 'toMaybe',
                    description: 'Constructs a `Just` with the value of `this` if it\'s `Right` or a `Nothing` if `this` is `Left`',
                    signatureML: 'Either a b ~> Maybe b',
                    signatureTS: '(): Maybe<R>',
                    examples: [
                        {input: `Left('Error').toMaybe()`, output: 'Nothing'},
                        {input: `Right(5).toMaybe()`, output: 'Just(5)'},
                    ]
                },
                {
                    name: 'leftToMaybe',
                    description: 'Constructs a `Just` with the value of `this` if it\'s `Left` or a `Nothing` if `this` is `Right`',
                    signatureML: 'Either a b ~> Maybe a',
                    signatureTS: '(): Maybe<L>',
                    examples: [
                        {input: `Left('Error').toMaybe()`, output: `Just('Error')`},
                        {input: `Right(5).toMaybe()`, output: 'Nothing'},
                    ]
                },
                {
                    name: 'ifLeft',
                    description: 'Runs an effect if `this` is `Left`, returns `this` for easier composiblity',
                    signatureTS: '(effect: (value: L) => any): this',
                    examples: [
                        {input: `Left('Error').ifLeft((err) => console.log(err))`, output: `// Error`},
                        {input: `Right(5).ifLeft(() => console.log('Unexpected error'))`, output: ''}
                    ]
                },
                {
                    name: 'ifRight',
                    description: 'Runs an effect if `this` is `Right`, returns `this` for easier composiblity',
                    signatureTS: '(effect: (value: R) => any): this',
                    examples: [
                        {input: `Left('Error').ifRight((result) => console.log(result))`, output: ``},
                        {input: `Right(5).ifRight((result) => console.log(result))`, output: '// 5'}
                    ]
                },
                {
                    name: 'either',
                    description: 'Given two map functions, maps using the first if `this` is `Left` or using the second one if `this` is `Right`. If you want the functions to return different types depending on the either you may want to use `Either#bimap` instead',
                    signatureML: '(a -⁠> c) -⁠> (b -⁠> c) -⁠> Either a b -⁠> c',
                    signatureTS: '<T>(ifLeft: (value: L) => T, ifRight: (value: R) => T): T',
                    examples: [
                        {input: 'Right(5).either(_ => 0, x => x + 1)', output: '6'},
                        {input: `Left('Error').either(x => x + '!', _ => '')`, output: `'Error!'`}
                    ]
                },
                {
                    name: 'extract',
                    description: 'Extracts the value out of `this`',
                    signatureTS: '(): L | R',
                    examples: [
                        {input: 'Right(5).extract()', output: '5'},
                        {input: `Left('Error').extract()`, output: `'Error'`}
                    ]
                }
            ]
        },
        {
            name: 'Tuple',
            implements: ['Setoid', 'Ord', 'Semigroup', 'Functor', 'Bifunctor', 'Apply'],
            description: `Tuple, also known as Pair, is a data type containing two values. You can think of it as an immutable array of only two elements, but unlike arrays (which are commonly homogeneous), the two values inside can be of different types.`,
            example: [
                `import { Tuple } from 'pure-ts/adts/Tuple'`, 
            ],
            constructors: [
                {
                    name: 'Tuple',
                    description: 'Constructs a tuple',
                    signatureML: 'a -> b -> (a, b)',
                    signatureTS: '<F, S>(fst: F, snd: S): Tuple<F, S>',
                    examples: [
                        {input: 'Tuple(1, true)', output: 'Tuple(1, true) // Tuple<number, boolean>'}
                    ]
                }
            ],
            staticMethods: [
                {
                    name: 'fromArray',
                    description: 'Constructs a tuple from an array with two elements',
                    signatureTS: '<F, S>([fst, snd]: [F, S]): Tuple<F, S>',
                    examples: [
                        {input: 'Tuple.fromArray([5, 10])', output: 'Tuple(5, 10)'}
                    ]
                },
                {
                    name: 'fanout',
                    description: 'Applies two functions over a single value and constructs a tuple from the results',
                    signatureML: '(a -> b) -> (a -> c) -> a -> (b, c)',
                    signatureTS: '<F, S, T>(f: (value: T) => F, g: (value: T) => S, value: T): Tuple<F, S>',
                    examples: [
                        {input: `Tuple.fanout(x => x[0], x => x.length, 'sss')`, output: `Tuple('s', 3)`},
                        {input: `Tuple.fanout(x => x[0], x => x.length)('sss')`, output: `Tuple('s', 3)`}
                    ]
                }
            ],
            instanceMethods: [
                {
                    name: 'fst',
                    description: 'Returns the first value from `this`',
                    signatureML: '(a, b) ~> a',
                    signatureTS: '(): F',
                    examples: [
                        {input: 'Tuple(5, 10).fst()', output: '5'}
                    ]
                },
                {
                    name: 'snd',
                    description: 'Returns the second value from `this`',
                    signatureML: '(a, b) ~> b',
                    signatureTS: '(): S',
                    examples: [
                        {input: 'Tuple(5, 10).snd()', output: '10'}
                    ]
                },
                {
                    name: 'equals',
                    description: 'Compares the values inside `this` and another tuple',
                    signatureML: '(a, b) ~> (a, b) -> Bool',
                    signatureTS: 'other: Tuple<F, S>): boolean',
                    examples: [
                        {input: 'Tuple(5, 10).equals(Tuple(5, 10))', output: 'true'},
                        {input: `Tuple(5, 'foo').equals(5, 'bar')`, output: 'false'}
                    ]
                },
                {
                    name: 'lte',
                    description: 'Returns true if both values inside `this` are less than or equal to the values inside anotther tuple, otherwise returns false',
                    signatureML: '(a, b) ~> (a, b) -> Bool',
                    signatureTS: '(other: Tuple<F, S>): boolean',
                    examples: [
                        {input: 'Tuple(5, 5).lte(Tuple(0, 0))', output: 'false'},
                        {input: 'Tuple(0, 5).lte(Tuple(5, 5))', output: 'true'},
                        {input: 'Tuple(10, 5).lte(Tuple(0, 10))', output: 'false'}
                    ]
                },
                {
                    name: 'bimap',
                    description: 'Transforms the two values inside `this` with two mapper functions',
                    signatureML: '(a, b) ~> (a -> c) -> (b -> d) -> (c, d)',
                    signatureTS: '<F2, S2>(f: (fst: F) => F2, g: (snd: S) => S2): Tuple<F2, S2>',
                    examples: [
                        {input: `Tuple(1, 'apple').bimap(x => x + 1, x => x + 's')`, output: `Tuple(2, 'apples')`}
                    ]
                },
                {
                    name: 'map',
                    description: 'Applies a function to the second value of `this`',
                    signatureML: '(a, b) ~> (b -> c) -> (a, c)',
                    signatureTS: '<S2>(f: (snd: S) => S2): Tuple<F, S2>',
                    examples: [
                        {input: `Tuple('configured', false).map(x => !x)`, output: `Tuple('configured', true)`}
                    ]
                },
                {
                    name: 'mapFirst',
                    description: 'Applies a function to the first value of `this`',
                    signatureML: '(a, b) ~> (a -> c) -> (c, b)',
                    signatureTS: '<F2>(f: (fst: F) => F2): Tuple<F2, S>',
                    examples: [
                        {input: `Tuple(2, 'items').mapFirst(x => x + 1)`, output: `Tuple(3, 'items')`}
                    ]
                },
                {
                    name: 'concat',
                    description: 'Concatinates the first and second values of `this` and another tuple',
                    signatureML: '(a, b) ~> (a, b) -> (a, b)',
                    signatureTS: '(other: Tuple<F, S>): Tuple<F, S>',
                    examples: [
                        {input: `Tuple('First name', [1, 2]).concat(Tuple(' Last name', [3, 4]))`, output: `Tuple('First name Last name', [1, 2, 3, 4])`}
                    ]
                },
                {
                    name: 'ap',
                    description: 'Applies the second value of a tuple to the second value of `this`',
                    signatureML: '(a, b) ~> (c, (b -> d)) -> (a, d)',
                    signatureTS: '<T, S2>(f: Tuple<T, (value: S) => S2>): Tuple<F, S2>',
                    examples: [
                        {input: `Tuple(5, 10).ap(Tuple('increment', x => x + 1))`, output: `Tuple(5, 11)`}
                    ]
                },
                {
                    name: 'swap',
                    description: 'Swaps the values inside `this`',
                    signatureML: '(a, b) ~> (b, a)',
                    signatureTS: '(): Tuple<S, F>',
                    examples: [
                        {input: 'Tuple(0, 1).swap()', output: 'Tuple(1, 0)'}
                    ]
                },
                {
                    name: 'toArray',
                    description: 'Returns an array with 2 elements - the values inside `this`',
                    signatureTS: '(): [F, S]',
                    examples: [
                        {input: `Tuple('username', true).toArray()`, output: `['username', true]`}
                    ]
                }
            ]
        },
        {
            name: 'Id',
            implements: ['Setoid', 'Ord', 'Semigroup', 'Function', 'Apply', 'Applicative', 'Chain', 'Monad'],
            description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.`,
            example: [''],
            constructors: [
                {
                    name: 'Id',
                    description: 'Contructs an Id',
                    signatureML: 'a -> Id a',
                    signatureTS: '<T>(value: T): Id<T>',
                    examples: [
                        {input: `Id('some primitive')`, output: `Id('some primitive') // Id<string>`}
                    ]
                }
            ],
            staticMethods: [
                {
                    name: 'of',
                    description: 'Contructs an Id',
                    signatureML: 'a -> Id a',
                    signatureTS: '<T>(value: T): Id<T>',
                    examples: [
                        {input: `Id.of('some primitive')`, output: `Id('some primitive')`}
                    ]
                }
            ],
            instanceMethods: [
                {
                    name: 'extract',
                    description: 'Returns the value stored in `this`',
                    signatureML: 'Id a -> a',
                    signatureTS: '(): T',
                    examples: [
                        {input: 'Id(1).extract()', output: '1'}
                    ]
                },
                {
                    name: 'map',
                    description: 'Applies a function to the value stored in `this`',
                    signatureML: 'Id a ~> (a -> b) -> Id b',
                    signatureTS: '<U>(f: (value: T) => U): Id<U>',
                    examples: [
                        {input: `Id('1').map(parseInt)`, output: 'Id(1)'}
                    ]
                },
                {
                    name: 'equals',
                    description: 'Compares the value in `this` with the value in the other `Id`',
                    signatureML: 'Id a ~> Id a -> Bool',
                    signatureTS: '(other: Id<T>): boolean',
                    examples: [
                        {input: `Id(0).equals(Id(0))`, output: 'true'}
                    ]
                },
                {
                    name: 'lte',
                    description: 'Returns true if the value in `this` is less than or equal to the value in the other `Id`, otherwise returns false',
                    signatureML: 'Id a ~> Id a -> Bool',
                    signatureTS: '(other: Id<T>): boolean',
                    examples: [
                        {input: `Id(5).lte(Id(10))`, output: 'true'},
                        {input: `Id(10).lte(Id(-1))`, output: 'false'}
                    ]
                },
                {
                    name: 'concat',
                    description: 'Concatinates the values inside `this` and another `Id`',
                    signatureML: 'Id a ~> Id a -> Id a',
                    signatureTS: '(other: Id<T>): Id<T>',
                    examples: [
                        {input: `Id('NaNaNaNa ').concat(Id('Batman!'))`, output: `Id('NaNaNaNa Batman!')`}
                    ]
                },
                {
                    name: 'ap',
                    description: 'Applies a function stored in Id to the value in `this`',
                    signatureML: 'Id a ~> Id (a -> b) -> Id b',
                    signatureTS: '<U>(f: Id<(value: T) => U>): Id<U>',
                    examples: [
                        {input: 'Id(5).ap(Id(x => x + 1))', output: 'Id(6)'}
                    ]
                },
                {
                    name: 'chain',
                    description: 'Transforms `this` with a function that returns an `Id`',
                    signatureML: 'Id a ~> (a -> Id b) -> Id b',
                    signatureTS: '<U>(f: (value: T) => Id<U>): Id<U>',
                    examples: [
                        {input: 'Id(10).chain(Id)', output: 'Id(10)'}
                    ]
                }
            ]
        },
    ],
    typeclasses: [
        // {name: 'Alt'},
        // {name: 'Alternative'},
        // {name: 'Applicative'},
        // {name: 'Apply'},
        // {name: 'Bifunctor'},
        // {name: 'Chain'},
        // {name: 'Extend'},
        // {name: 'Foldable'},
        // {name: 'Functor'},
        // {name: 'Monad'},
        // {name: 'Monoid'},
        // {name: 'Ord'},
        // {name: 'Plus'},
        // {name: 'Semigroup'},
        // {name: 'Setoid'},
        // {name: 'Traversable'},
        // {name: 'Unsafe'},
    ]
}

export default data