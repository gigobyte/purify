import React from 'react'

const data = {
    datatypes: [
        {
            name: 'Maybe',
            slug: 'maybe',
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
                }
            ]
        },
        {name: 'Either', slug: 'either', methods: []}
    ]
}

export default data