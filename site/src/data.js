import React from 'react'

const data = {
    datatypes: [
        {
            name: 'Maybe',
            slug: 'maybe',
            description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.`,
            constructors: [
                {
                    name: 'Just',
                    description: 'Constructs a Just',
                    signatureML: 'a → Maybe a',
                    signatureTS: '<T>(value: T): Maybe<T>',
                    example: 'const val: Maybe<number> = Just(10)'
                },
                {
                    name: 'Nothing',
                    description: 'Exported Nothing',
                    example: 'const nothing: Maybe<never> = Nothing'
                }
            ],
            staticMethods: [
                {
                    name: 'of',
                    signatureML: 'a → Maybe a',
                    signatureTS: '<T>(value: T): Maybe<T>',
                    description: 'Takes a value and wraps it in a `Just`',
                    example: 'const val: Maybe<number> = Maybe.of(10)'
                },
                {
                    name: 'empty',
                    signatureML: '() → Maybe a',
                    signatureTS: '(): Maybe<never>',
                    description: 'Returns Nothing',
                    example: 'const nothing: Maybe<never> = Maybe.empty()'
                },
                {
                    name: 'zero',
                    signatureML: '() → Maybe a',
                    signatureTS: '(): Maybe<never>',
                    description: 'Returns Nothing',
                    example: 'const nothing: Maybe<never> = Maybe.zero()'
                },
                {
                    name: 'toMaybe',
                    signatureTS: '<T>(value?: T): Maybe<T>',
                    description: 'Takes a value and returns Nothing if the value is null or undefined, otherwise a Just is returned',
                    example: (
                        <div>
                            <div>{`const nothing: Maybe<never> = Maybe.toMaybe(null)`}</div>
                            <div>{`const val = Maybe<number> = Maybe.toMaybe(10)`}</div>
                        </div>
                    )
                }
            ]
        },
        {name: 'Either', slug: 'either', methods: []}
    ]
}

export default data