import React from 'react'

const data = {
    datatypes: [
        {
            name: 'Maybe',
            implements: ['Setoid', 'Ord', 'Semigroup', 'Monoid', 'Functor', 'Apply', 'Applicative', 'Alt', 'Plus', 'Alternative', 'Chain', 'Monad', 'Foldable', 'Extend', 'Unsafe'],
            description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.`,
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
                    description: 'Returns Nothing',
                    examples: [
                        {input: 'Maybe.empty()', output: 'Nothing'}
                    ]
                },
                {
                    name: 'zero',
                    signatureML: '() → Maybe a',
                    signatureTS: '(): Maybe<never>',
                    description: 'Returns Nothing',
                    examples: [
                        {input: 'Maybe.zero()', output: 'Nothing'}
                    ]
                },
                {
                    name: 'toMaybe',
                    signatureTS: '<T>(value?: T): Maybe<T>',
                    description: 'Takes a value and returns Nothing if the value is null or undefined, otherwise a Just is returned',
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
                    signatureTS: '(): boolean',
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
                    description: 'Concatenates a value to the value inside `this`.',
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
                    description: 'Return `this` if it\'s `Nothing`, otherwise it returns the result of applying the function argument to `this` and wrapping it in a `Just`',
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
        {name: 'Either', methods: []},
        {name: 'Tuple', methods: []},
        {name: 'Id', methods: []},
    ],
    typeclasses: [
        {name: 'Alt'},
        {name: 'Alternative'},
        {name: 'Applicative'},
        {name: 'Apply'},
        {name: 'Bifunctor'},
        {name: 'Chain'},
        {name: 'Extend'},
        {name: 'Foldable'},
        {name: 'Functor'},
        {name: 'Monad'},
        {name: 'Monoid'},
        {name: 'Ord'},
        {name: 'Plus'},
        {name: 'Semigroup'},
        {name: 'Setoid'},
        {name: 'Traversable'},
        {name: 'Unsafe'},
    ]
}

export default data