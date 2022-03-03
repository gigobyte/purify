import * as React from 'react'
import { Note } from './pages/guides/maybe-api-guide'
import { Highlight, HL } from './components/HL'

export interface MethodExample {
  input: React.ReactNode
  output: React.ReactNode
}

export interface DataTypeExample {
  title: string
  content: string[]
}

export interface DataTypeGuide {
  title: string
  link: string
}

export interface Method {
  name: string
  description: React.ReactNode
  signatureML?: string
  signatureTS?: string
  examples: MethodExample[]
}

export interface DataType {
  name: string
  implements: string[]
  guides: DataTypeGuide[]
  description: React.ReactNode
  examples: DataTypeExample[]
  content: {
    title: React.ReactNode
    id: string
    methods: Method[]
  }[]
}

export interface Util {
  name: string
  description: React.ReactNode
  example: {
    import: string
    before?: string[]
    after?: string[]
  }
  content: {
    title: React.ReactNode
    id: string
    methods: Method[]
  }[]
}

export interface Data {
  datatypes: DataType[]
  utils: Util[]
}

const data: Data = {
  datatypes: [
    {
      name: 'Maybe',
      implements: [
        'Setoid',
        'Functor',
        'Apply',
        'Applicative',
        'Alt',
        'Plus',
        'Alternative',
        'Chain',
        'Monad',
        'Foldable',
        'Extend',
        'Filterable'
      ],
      description: `The Maybe type is one of the most popular data types available. It is fundamental to learning about functional error handling and representing missing values. A Maybe value can be either Just a value or Nothing. The Just data constructor is used for wrapping present values while the Nothing constructor is used when a value is absent. Both constructors produce objects that share the same API which makes it easy to manipulate optional values without null checking or exception handling.`,
      examples: [
        {
          title: 'How to import',
          content: [`import { Maybe, Just, Nothing } from 'purify-ts/Maybe'`]
        },
        {
          title: 'Without Maybe',
          content: [
            `// Hard to chain additional transformations`,
            `// Doesn't protect against falsy values like empty string or 0`,
            '',
            'const config: Config | null = getConfig()',
            '',
            'const port = config && config.port',
            '    ? parseInt(config.port)',
            '    : 8080'
          ]
        },
        {
          title: 'Without Maybe (since TS 3.7 / ES2020)',
          content: [
            `// Still hard to chain additional transformations`,
            "// This is a valid alternative if you don't mind the syntax",
            '',
            "const port = parseInt(getConfig()?.port ?? '8080')"
          ]
        },
        {
          title: 'With Maybe',
          content: [
            'const port = getConfig()',
            '    .chain(x => x.port)',
            '    .map(parseInt)',
            '    .orDefault(8080)'
          ]
        }
      ],
      guides: [
        {
          title: 'Which method am I supposed to use now? (API guide)',
          link: '/guides/maybe-api-guide'
        }
      ],
      content: [
        {
          title: 'Constructors',
          id: 'constructor',
          methods: [
            {
              name: 'Just',
              description:
                'Constructs a Just. Represents an optional value that exists.',
              signatureML: 'a -> Maybe a',
              signatureTS: '<T>(value: T): Maybe<T>',
              examples: [
                { input: 'Just(10)', output: 'Just(10) // Maybe<number>' }
              ]
            },
            {
              name: 'Nothing',
              description: `Nothing doesn't have a constructor, instead you can use it directly as a value. Represents a missing value, you can think of it as a smart 'null'.`,
              examples: [
                { input: 'Nothing', output: 'Nothing // Maybe<never>' }
              ]
            }
          ]
        },
        {
          title: 'Static methods',
          id: 'static',
          methods: [
            {
              name: 'of',
              signatureML: 'a -> Maybe a',
              signatureTS: '<T>(value: T): Maybe<T>',
              description: 'Takes a value and wraps it in a `Just`.',
              examples: [{ input: 'Maybe.of(10)', output: 'Just(10)' }]
            },
            {
              name: 'empty',
              signatureML: '() -> Maybe a',
              signatureTS: '(): Maybe<never>',
              description: 'Returns `Nothing`.',
              examples: [{ input: 'Maybe.empty()', output: 'Nothing' }]
            },
            {
              name: 'zero',
              signatureML: '() -> Maybe a',
              signatureTS: '(): Maybe<never>',
              description: 'Returns `Nothing`.',
              examples: [{ input: 'Maybe.zero()', output: 'Nothing' }]
            },
            {
              name: 'fromNullable',
              signatureTS: '<T>(value?: T): Maybe<T>',
              description:
                'Takes a value and returns `Nothing` if the value is null or undefined, otherwise a `Just` is returned.',
              examples: [
                { input: 'Maybe.fromNullable(null)', output: 'Nothing' },
                { input: 'Maybe.fromNullable(10)', output: 'Just(10)' }
              ]
            },
            {
              name: 'fromFalsy',
              signatureTS: '<T>(value?: T): Maybe<T>',
              description:
                'Takes a value and returns Nothing if the value is falsy, otherwise a Just is returned.',
              examples: [
                { input: `Maybe.fromFalsy('')`, output: 'Nothing' },
                { input: 'Maybe.fromFalsy(0)', output: 'Nothing' }
              ]
            },
            {
              name: 'fromPredicate',
              signatureML: '(a -> Bool) -> a -> Maybe a',
              signatureTS:
                '<T>(pred: (value: T) => boolean, value: T): Maybe<T>',
              description:
                'Takes a predicate and a value, passes the value to the predicate and returns a Just if it returns true, otherwise a Nothing is returned',
              examples: [
                {
                  input: 'Maybe.fromPredicate(x => x > 0, 5)',
                  output: 'Just(5)'
                },
                {
                  input: 'Maybe.fromPredicate(x => x > 0, -1)',
                  output: 'Nothing'
                }
              ]
            },
            {
              name: 'catMaybes',
              signatureML: '[Maybe a] -> [a]',
              signatureTS: '<T>(list: Maybe<T>[]): T[]',
              description: 'Returns only the `Just` values in a list.',
              examples: [
                {
                  input: 'Maybe.catMaybes([Just(5), Nothing, Just(10)])',
                  output: '[5, 10]'
                }
              ]
            },
            {
              name: 'mapMaybe',
              signatureML: '(a -> Maybe b) -> [a] -> [b]',
              signatureTS: '<T, U>(f: (value: T) => Maybe<U>, list: T[]): U[]',
              description:
                'Maps over a list of values and returns a list of all resulting `Just` values.',
              examples: [
                {
                  input: `Maybe.mapMaybe(x => isNaN(x) ? Nothing : Just(parseInt(x)), ['1', 'Apple', '3'])`,
                  output: '[1, 3]'
                }
              ]
            },
            {
              name: 'sequence',
              signatureML: '[Maybe a] -> Maybe [a]',
              signatureTS: '<T>(maybes: Maybe<T>[]): Maybe<T[]>',
              description:
                'Turns a list of `Maybe`s into an `Maybe` of list if all items are `Just`.',
              examples: [
                {
                  input: `Maybe.sequence([Just(1), Just(5), Just(10)])`,
                  output: 'Just([1, 5, 10])'
                },
                {
                  input: `Maybe.sequence([Just(1), Nothing, Just(10)])`,
                  output: 'Nothing'
                }
              ]
            },
            {
              name: 'encase',
              signatureTS: '<T>(throwsF: () => T): Maybe<T>',
              description:
                'Calls a function that may throw and wraps the result in a `Just` if successful or `Nothing` if an error is caught.',
              examples: [
                {
                  input: `Maybe.encase(() => { throw Error('Always fails') })`,
                  output: 'Nothing'
                },
                { input: `Maybe.encase(() => 10)`, output: 'Just(10)' }
              ]
            },
            {
              name: 'isMaybe',
              signatureTS: '<T>(x: unknown): x is Maybe<T>',
              description: '',
              examples: [
                {
                  input: 'Maybe.isMaybe(null)',
                  output: 'false'
                },
                {
                  input: 'Maybe.isMaybe(Just(10))',
                  output: 'true'
                }
              ]
            }
          ]
        },
        {
          title: 'Instance methods',
          id: 'instance',
          methods: [
            {
              name: 'isJust',
              signatureML: 'Maybe a ~> Bool',
              signatureTS: '(): boolean',
              description:
                'Returns true if `this` is `Just`, otherwise it returns false.',
              examples: [
                { input: 'Just(5).isJust()', output: 'true' },
                { input: 'Nothing.isJust()', output: 'false' }
              ]
            },
            {
              name: 'isNothing',
              signatureML: 'Maybe a ~> Bool',
              signatureTS: '(): this is Maybe<never>',
              description:
                'Returns true if `this` is `Nothing`, otherwise it returns false.',
              examples: [
                { input: 'Just(5).isNothing()', output: 'false' },
                { input: 'Nothing.isNothing()', output: 'true' }
              ]
            },
            {
              name: 'caseOf',
              signatureTS:
                '<U>(patterns: {Just: (value: T) => U, Nothing: () => U} | {_: () => U}): U',
              description:
                'Structural pattern matching for `Maybe` in the form of a function.',
              examples: [
                {
                  input:
                    'Just(5).caseOf({ Just: x => x + 1, Nothing: () => 0 })',
                  output: '6'
                },
                {
                  input:
                    'Nothing.caseOf({ Just: x => x + 1, Nothing: () => 0 })',
                  output: '0'
                },
                {
                  input: `Nothing.caseOf({ _: () => 'anything'}) // wildcard`,
                  output: `'anything'`
                }
              ]
            },
            {
              name: 'equals',
              signatureML: 'Maybe a ~> Maybe a -> Bool',
              signatureTS: '(other: Maybe<T>): boolean',
              description:
                'Compares the values inside `this` and the argument, returns true if both are Nothing or if the values are equal.',
              examples: [
                { input: 'Just(5).equals(Just(5))', output: 'true' },
                { input: 'Just(5).equals(Just(10))', output: 'false' },
                { input: 'Just(5).equals(Nothing)', output: 'false' }
              ]
            },
            {
              name: 'map',
              signatureML: 'Maybe a ~> (a -> b) -> Maybe b',
              signatureTS: '<U>(f: (value: T) => U): Maybe<U>',
              description:
                'Transforms the value inside `this` with a given function. Returns `Nothing` if `this` is `Nothing`.',
              examples: [
                { input: 'Just(5).map(x => x + 1)', output: 'Just(6)' },
                { input: 'Nothing.map(x => x + 1)', output: 'Nothing' }
              ]
            },
            {
              name: 'ap',
              signatureML: 'Maybe a ~> Maybe (a -> b) -> Maybe b',
              signatureTS: '<U>(maybeF: Maybe<(value: T) => U>): Maybe<U>.',
              description: 'Maps `this` with a `Maybe` function',
              examples: [
                { input: 'Just(5).ap(Just(x => x + 1))', output: 'Just(6)' },
                { input: 'Just(5).ap(Nothing)', output: 'Nothing' },
                { input: 'Nothing.ap(Just(x => x + 1))', output: 'Nothing' },
                { input: 'Nothing.ap(Nothing)', output: 'Nothing' }
              ]
            },
            {
              name: 'alt',
              signatureML: 'Maybe a ~> Maybe a -> Maybe a',
              signatureTS: '(other: Maybe<T>): Maybe<T>',
              description:
                'Returns the first `Just` between `this` and another `Maybe` or `Nothing` if both `this` and the argument are `Nothing`.',
              examples: [
                { input: 'Just(5).alt(Just(6))', output: 'Just(5)' },
                { input: 'Just(5).alt(Nothing)', output: 'Just(5)' },
                { input: 'Nothing.alt(Just(5))', output: 'Just(5)' },
                { input: 'Nothing.alt(Nothing)', output: 'Nothing' }
              ]
            },
            {
              name: 'altLazy',
              signatureML: 'Maybe a ~> (() -> Maybe a) -> Maybe a',
              signatureTS: '(other: () => Maybe<T>): Maybe<T>',
              description: 'Lazy version of `alt`.',
              examples: []
            },
            {
              name: 'chain',
              signatureML: 'Maybe a ~> (a -> Maybe b) -> Maybe b',
              signatureTS: '<U>(f: (value: T) => Maybe<U>): Maybe<U>',
              description:
                'Transforms `this` with a function that returns a `Maybe`. Useful for chaining many computations that may result in a missing value.',
              examples: [
                { input: 'Just(5).chain(x => Just(x + 1))', output: 'Just(6)' },
                { input: 'Nothing.chain(x => Just(x + 1))', output: 'Nothing' }
              ]
            },
            {
              name: 'chainNullable',
              signatureTS:
                '<U>(f: (value: T) => U | undefined | null | void): Maybe<U>',
              description:
                'Transforms `this` with a function that returns a nullable value. Equivalent to `m.chain(x => Maybe.fromNullable(f(x)))`.',
              examples: [
                {
                  input: 'Just({prop: null}).chainNullable(x => x.prop)',
                  output: 'Nothing'
                },
                {
                  input: 'Just(5).chainNullable(x => x + 1)',
                  output: 'Just(6)'
                }
              ]
            },
            {
              name: 'join',
              signatureML: 'Maybe (Maybe a) ~> Maybe a',
              signatureTS: '<U>(this: Maybe<Maybe<U>>): Maybe<U>',
              description:
                'Flattens nested Maybes. `m.join()` is equivalent to `m.chain(x => x)`.',
              examples: [
                { input: 'Just(Just(5)).join()', output: 'Just(5)' },
                { input: 'Nothing.join()', output: 'Nothing' }
              ]
            },
            {
              name: 'reduce',
              signatureML: 'Maybe a ~> ((b, a) -> b, b) -> b',
              signatureTS:
                '<U>(reducer: (accumulator: U, value: T) => U, initialValue: U): U',
              description:
                'Takes a reducer and an initial value and returns the initial value if `this` is `Nothing` or the result of applying the function to the initial value and the value inside `this`.',
              examples: [
                {
                  input: 'Just(5).reduce((acc, x) => x * acc, 2)',
                  output: '10'
                },
                {
                  input: 'Nothing.reduce((acc, x) => x * acc, 0)',
                  output: '0'
                }
              ]
            },
            {
              name: 'extend',
              signatureML: 'Maybe a ~> (Maybe a -> b) -> Maybe b',
              signatureTS: '<U>(f: (value: Maybe<T>) => U): Maybe<U>',
              description:
                "Returns `this` if it's `Nothing`, otherwise it returns the result of applying the function argument to `this` and wrapping it in a `Just`.",
              examples: [
                {
                  input: 'Just(5).extend(x => x.isJust())',
                  output: 'Just(true)'
                },
                { input: 'Nothing.extend(x => x.isJust())', output: 'Nothing' }
              ]
            },
            {
              name: 'unsafeCoerce',
              signatureML: 'Maybe a ~> a ',
              signatureTS: '(): T',
              description:
                'Returns the value inside `this` or throws an error if `this` is `Nothing`.',
              examples: [
                { input: 'Just(5).unsafeCoerce()', output: '5' },
                {
                  input: 'Nothing.unsafeCoerce()',
                  output:
                    '// Uncaught Error: Maybe#unsafeCoerce was ran on a Nothing'
                }
              ]
            },
            {
              name: 'orDefault',
              signatureML: 'Maybe a ~ a -> a',
              signatureTS: '(defaultValue: T): T',
              description:
                'Returns the default value if `this` is `Nothing`, otherwise it returns the value inside `this`.',
              examples: [
                { input: 'Just(5).orDefault(0)', output: '5' },
                { input: 'Nothing.orDefault(0)', output: '0' }
              ]
            },
            {
              name: 'orDefaultLazy',
              signatureML: 'Maybe a ~ (() -> a) -> a',
              signatureTS: '(getDefaultValue: () => T): T',
              description:
                'Lazy version of `orDefault`. Takes a function that returns the default value, that function will be called only if `this` is `Nothing`',
              examples: [
                {
                  input: 'Just(5).orDefaultLazy(() => expensiveComputation())',
                  output: '5 // expensiveComputation is never called'
                },
                { input: 'Nothing.orDefaultLazy(() => 0)', output: '0' }
              ]
            },
            {
              name: 'mapOrDefault',
              signatureML: 'Maybe a ~> (a -> b) -> b -> b',
              signatureTS: '<U>(f: (value: T) => U, defaultValue: U): U',
              description:
                'Maps over `this` and returns the resulting value or returns the default value if `this` is `Nothing`.',
              examples: [
                { input: 'Just(5).mapOrDefault(x => x + 1, 0)', output: '6' },
                { input: 'Nothing.mapOrDefault(x => x + 1, 0)', output: '0' }
              ]
            },
            {
              name: 'filter',
              signatureML: 'Maybe a ~> (a -> Bool) -> Maybe a',
              signatureTS: '(pred: (value: T) => boolean): Maybe<T>',
              description:
                'Takes a predicate function and returns `this` if the predicate returns true or Nothing if it returns false.',
              examples: [
                { input: `Just(5).filter(x => x > 1)`, output: 'Just(5)' },
                {
                  input: `Just('apple').filter(x => x === 'banana')`,
                  output: 'Nothing'
                }
              ]
            },
            {
              name: 'extract',
              signatureTS: '(): T | undefined',
              description:
                'Returns the value inside `this` or undefined if `this` is `Nothing`. Use `extractNullable` if you need a null returned instead.',
              examples: [
                { input: 'Just(5).extract()', output: '5' },
                { input: 'Nothing.extract()', output: 'undefined' }
              ]
            },
            {
              name: 'extractNullable',
              signatureTS: '(): T | null',
              description:
                'Returns the value inside `this` or null if `this` is `Nothing`. Use `extract` if you need an undefined returned instead.',
              examples: [
                { input: 'Just(5).extractNullable()', output: '5' },
                { input: 'Nothing.extractNullable()', output: 'null' }
              ]
            },
            {
              name: 'toList',
              signatureML: 'Maybe a ~> [a]',
              signatureTS: '(): T[]',
              description:
                'Returns empty list if the `Maybe` is `Nothing` or a list where the only element is the value of `Just`.',
              examples: [
                { input: 'Just(5).toList()', output: '[5]' },
                { input: 'Nothing.toList()', output: '[]' }
              ]
            },
            {
              name: 'toEither',
              signatureML: 'Maybe a ~> e -> Either e a',
              signatureTS: '<L>(left: L): Either<L, T>',
              description:
                'Constructs a `Right` from a `Just` or a `Left` with a provided left value if `this` is `Nothing`.',
              examples: [
                { input: `Just(5).toEither('Error')`, output: 'Right(5)' },
                { input: `Nothing.toEither('Error')`, output: `Left('Error')` }
              ]
            },
            {
              name: 'ifJust',
              signatureTS: '(effect: (value: T) => any): this',
              description:
                'Runs an effect if `this` is `Just`, returns `this` to make chaining other methods possible.',
              examples: [
                {
                  input: `Just(5).ifJust(() => console.log('success'))`,
                  output: `// success`
                },
                {
                  input: `Nothing.ifJust(() => console.log('success'))`,
                  output: ''
                }
              ]
            },
            {
              name: 'ifNothing',
              signatureTS: '(effect: (value: T) => any): this',
              description:
                'Runs an effect if `this` is `Nothing`, returns `this` to make chaining other methods possible.',
              examples: [
                {
                  input: `Just(5).ifNothing(() => console.log('failure'))`,
                  output: ''
                },
                {
                  input: `Nothing.ifNothing(() => console.log('failure'))`,
                  output: '// failure'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'MaybeAsync',
      implements: ['Functor', 'Chain', 'Apply', 'Alt', 'Extend', 'Filterable'],
      guides: [
        {
          title: 'MaybeAsync and EitherAsync for Haskellers',
          link: '/guides/maybeasync-eitherasync-for-haskellers'
        },
        {
          title: 'MaybeAsync used in an example repo',
          link: 'https://github.com/gigobyte/ts-react-express-starter/tree/main/server/src'
        }
      ],
      description: (
        <div>
          {'MaybeAsync is a wrapper (and hopefully a drop-in replacement) of'}{' '}
          <HL>{'Promise<Maybe<T>>'}</HL>
          {
            'that allows you to process asynchronous values while also having error handling via Maybe. MaybeAsync even implements'
          }
          <HL>PromiseLike</HL>
          {', so you want await it just like a regular Promise.'}
          <br />
          <br />
          {
            '\nThat said, there are 2 ways of composing MaybeAsync values, just like there are two ways of working with Promises - async/await and chaining together transformations.  If you squint hard you can see that MaybeAsync tries really hard to be a '
          }{' '}
          <a href="https://wiki.haskell.org/Monad_Transformers_Explained">
            monad transformer
          </a>
          {
            ', which is true, but constraining it to Promises brought a tremendous amount of value and the trade-off is worth it.'
          }
        </div>
      ),
      examples: [
        {
          title: 'How to import',
          content: [`import { MaybeAsync } from 'purify-ts/MaybeAsync'`]
        },
        {
          title: 'Given the following functions, examples below',
          content: [
            `function validateRequest(req: Request): Maybe<DeleteUserRequest>`,
            `function getUser(userId: number):       Promise<Maybe<User>>`,
            `function deleteUserDb(user: User):      Promise<Id<User>>`
          ]
        },
        {
          title: 'Example usage (async/await)',
          content: [
            'const deleteUser = (req): MaybeAsync<Id<User>> =>',
            '    MaybeAsync(async ({ liftMaybe, fromPromise }) => {',
            '        // when you have Maybe<T> and you want to get T out',
            '        const request = await liftMaybe(validateRequest(req))',
            '',
            '        // when you have Promise<Maybe<T>> and you want to get T out',
            '        const user    = await fromPromise(getUser(request.userId))',
            '',
            '        return deleteUserDb(user)',
            '    })',
            '',
            'const promise: Promise<Maybe<Id<User>>> = deleteUser(req).run()'
          ]
        },
        {
          title: 'Example usage (chaining)',
          content: [
            'const deleteUser = (req): MaybeAsync<Id<User>> =>',
            '    MaybeAsync.liftMaybe(validateRequest(req))',
            '        // Promise<Maybe<T>> or MaybeAsync<T> (both work)',
            '        // and you want to chain it',
            '        .chain(request => getUser(request.userId))',
            '',
            '        // when you have Promise<T> and you want to chain it',
            '        .chain(user    => MaybeAsync(() => deleteUserDb(user)))',
            '',
            'const promise: Promise<Maybe<Id<User>>> = deleteUser(req).run()'
          ]
        }
      ],
      content: [
        {
          title: 'Constructors',
          id: 'constructor',
          methods: [
            {
              name: 'MaybeAsync',
              description:
                'Constructs a MaybeAsync object from a function that takes an object full of helpers that let you lift things into the MaybeAsync context and returns a Promise.',
              examples: [
                {
                  input:
                    'MaybeAsync(({ liftMaybe, fromPromise }) => Promise.resolve(5))',
                  output: 'MaybeAsync<number>'
                }
              ],
              signatureML: '(MaybeAsyncHelpers -> IO a) -> MaybeAsync a',
              signatureTS: `<T>(runPromise: (helpers: MaybeAsyncHelpers) => PromiseLike<T>): MaybeAsync<T>`
            }
          ]
        },
        {
          title: 'Static methods',
          id: 'static',
          methods: [
            {
              name: 'fromPromise',
              description:
                'Constructs an MaybeAsync object from a function that returns a Maybe wrapped in a Promise. It is recommended to stick to one style of using MaybeAsync only as you will run into nasty variable shadowing if you use the helpers for async/await while you have any of the constructors imported.',
              examples: [
                {
                  input:
                    'MaybeAsync.fromPromise(() => Promise.resolve(Just(5)))',
                  output: 'MaybeAsync<number>'
                }
              ],
              signatureML: '(() -> IO (Maybe a)) -> MaybeAsync a',
              signatureTS: `<T>(f: () => Promise<Maybe<T>>): MaybeAsync<T>`
            },
            {
              name: 'liftMaybe',
              description: 'Constructs an MaybeAsync object from a Maybe.',
              examples: [
                {
                  input: 'MaybeAsync.liftMaybe(Just(5))',
                  output: 'MaybeAsync<number>'
                }
              ],
              signatureML: 'Maybe a -> MaybeAsync a',
              signatureTS: `<T>(maybe: Maybe<T>): MaybeAsync<T>`
            },
            {
              name: 'catMaybes',
              description:
                'Takes a list of `MaybeAsync`s and returns a Promise that will resolve with all `Just` values. Internally it uses `Promise.all` to wait for all results.',
              examples: [
                {
                  input: `MaybeAsync.catMaybes([
  MaybeAsync(async () => 'value1'),
  MaybeAsync.liftMaybe(Nothing),
  MaybeAsync(async () => 'value2')
])`,
                  output: `Promise {<resolved>: ['value1', 'value2']}`
                }
              ],
              signatureML: '[MaybeAsync a] -> IO [a]',
              signatureTS: `<T>(list: MaybeAsync<T>[]): Promise<T[]>`
            }
          ]
        },
        {
          title: 'Instance methods',
          id: 'instance',
          methods: [
            {
              name: 'run',
              signatureML: 'MaybeAsync a ~> IO (Maybe a)',
              signatureTS: 'run(): Promise<Maybe<T>>',
              description: (
                <div>
                  <b>IMPORTANT: </b> The Promise returned from `run` will never
                  be rejected, so there's no point in calling `catch` on it. If
                  something goes wrong, here's how it's going to be handled:
                  <ul>
                    <li>
                      If any of the computations inside MaybeAsync resolved to
                      Nothing, `run` will return a Promise resolved to Nothing.
                    </li>
                    <li>
                      If any of the promises were to be rejected then `run` will
                      return a Promise resolved to Nothing.
                    </li>
                    <li>
                      If an exception is thrown then `run` will return a Promise
                      resolved to Nothing.
                    </li>
                    <li>
                      If none of the above happen then a promise resolved to the
                      returned value wrapped in a Just will be returned.
                    </li>
                  </ul>
                </div>
              ),
              examples: [
                {
                  input:
                    'MaybeAsync(async ({ liftMaybe }) => liftMaybe(Nothing)).run()',
                  output: 'Promise {<resolved>: Nothing}'
                },
                {
                  input: 'MaybeAsync(() => Promise.reject()).run()',
                  output: 'Promise {<resolved>: Nothing}'
                },
                {
                  input: `MaybeAsync(() => { throw Error('Something happened') }).run()`,
                  output: 'Promise {<resolved>: Nothing}'
                },
                {
                  input: 'MaybeAsync(() => Promise.resolve(5)).run()',
                  output: 'Promise {<resolved>: Just(5)}'
                }
              ]
            },
            {
              name: 'map',
              description:
                "Transforms the value inside `this` with a given function. If the MaybeAsync that is being mapped resolves to Nothing then the mapping function won't be called and `run` will resolve the whole thing to Nothing, just like the regular Maybe#map.",
              signatureML: 'MaybeAsync a ~> (a -> b) -> MaybeAsync b',
              signatureTS: '<U>(f: (value: T) => U): MaybeAsync<U>',
              examples: [
                {
                  input:
                    'MaybeAsync(() => Promise.resolve(5)).map(x => x + 1).run()',
                  output: 'Promise {<resolved>: Just(6)}'
                }
              ]
            },
            {
              name: 'chain',
              description:
                'Transforms `this` with a function that returns a `MaybeAsync` or another `PromiseLike`. Behaviour is the same as the regular Maybe#chain.',
              signatureTS:
                '<U>(f: (value: T) => PromiseLike<Maybe<U>>): MaybeAsync<U>',
              examples: [
                {
                  input: `MaybeAsync(async () => 5).chain(x => MaybeAsync(async () => x + 1)).run()`,
                  output: 'Promise {<resolved>: Just(6)}'
                },
                {
                  input: `MaybeAsync(async () => 5).chain(async (x) => Just(x + 1)).run()`,
                  output: 'Promise {<resolved>: Just(6)}'
                }
              ]
            },
            {
              name: 'orDefault',
              signatureTS: '(defaultValue: T): Promise<T>',
              signatureML: 'MaybeAsync a ~> a -> IO a',
              description:
                'Returns the default value if `this` is `Nothing`, otherwise it returns a Promise that will resolve to the value inside `this`.',
              examples: []
            },
            {
              name: 'ap',
              signatureTS:
                '<U>(maybeF: PromiseLike<Maybe<(value: T) => U>>): MaybeAsync<U>',
              description:
                'Runs an effect if `this` is `Nothing`, returns `this` to make chaining other methods possible.',
              examples: []
            },
            {
              name: 'alt',
              signatureTS: '(other: MaybeAsync<T>): MaybeAsync<T>',
              signatureML: 'MaybeAsync a ~> MaybeAsync a -> MaybeAsync a',
              description:
                'Returns the first `Just` between the future value of `this` and another future `Maybe` or future `Nothing` if both `this` and the argument are `Nothing`.',
              examples: []
            },
            {
              name: 'extend',
              signatureTS: '<U>(f: (value: MaybeAsync<T>) => U): MaybeAsync<U>',
              signatureML:
                'MaybeAsync a ~> (MaybeAsync a -> b) -> MaybeAsync b',
              description:
                'Returns `this` if it resolves to `Nothing`, otherwise it returns the result of applying the function argument to the value of `this` and wrapping it in a `Just`.',
              examples: []
            },
            {
              name: 'filter',
              signatureTS: '(pred: (value: T) => boolean): MaybeAsync<T>',
              signatureML: 'MaybeAsync a ~> (a -> Bool) -> MaybeAsync a',
              description: `Takes a predicate function and returns \`this\` if the predicate, applied to the resolved value, is true or Nothing if it's false.`,
              examples: []
            },
            {
              name: 'join',
              signatureTS:
                '<U>(this: MaybeAsync<MaybeAsync<U>>): MaybeAsync<U>',
              signatureML: 'MaybeAsync (MaybeAsync a) ~> MaybeAsync a',
              description:
                'Flattens nested `MaybeAsync`s. `m.join()` is equivalent to `m.chain(x => x).',
              examples: []
            },
            {
              name: 'toEitherAsync',
              description:
                'Converts `this` to a EitherAsync with a default error value',
              signatureML: 'MaybeAsync b ~> a -> EitherAsync a b',
              signatureTS: '<L>(error: L): EitherAsync<L, T>',
              examples: []
            },
            {
              name: 'ifJust',
              signatureTS: '(effect: (value: T) => any): MaybeAsync<T>',
              description:
                'Runs an effect if `this` is `Just`, returns `this` to make chaining other methods possible.',
              examples: [
                {
                  input: `MaybeAsync.liftMaybe(Just(5)).ifJust(() => console.log('success'))`,
                  output: `// success`
                },
                {
                  input: `MaybeAsync.liftMaybe(Nothing).ifJust(() => console.log('success'))`,
                  output: ''
                }
              ]
            },
            {
              name: 'ifNothing',
              signatureTS: '(effect: (value: T) => any): MaybeAsync<T>',
              description:
                'Runs an effect if `this` is `Nothing`, returns `this` to make chaining other methods possible.',
              examples: [
                {
                  input: `MaybeAsync.liftMaybe(Just(5)).ifNothing(() => console.log('failure'))`,
                  output: ''
                },
                {
                  input: `MaybeAsync.liftMaybe(Nothing).ifNothing(() => console.log('failure'))`,
                  output: '// failure'
                }
              ]
            },
            {
              name: 'void',
              signatureTS: '(): MaybeAsync<void>',
              description:
                'Useful if you are not interested in the result of an operation.',
              examples: []
            },
            {
              name: 'caseOf',
              signatureTS: '<U>(patterns: MaybePatterns<T, U>): Promise<U>',
              description:
                'Structural pattern matching for `MaybeAsync` in the form of a function.',
              examples: [
                {
                  input: `MaybeAsync.liftMaybe(Nothing).caseOf({ Just: x => x, Nothing: () => 'failure' })`,
                  output: `Promise {<resolved>: 'failure'}`
                },
                {
                  input: `MaybeAsync.liftMaybe(Just(6)).caseOf({ Nothing: () => 0, Just: x => x + 1 })`,
                  output: 'Promise {<resolved>: 7}'
                },
                {
                  input: `MaybeAsync.liftMaybe(Nothing).caseOf({ _: () => 0 }) // wildcard`,
                  output: 'Promise {<resolved>: 0}'
                }
              ]
            },
            {
              name: 'finally',
              signatureTS: '(effect: () => any): MaybeAsync<T>',
              description:
                'Similar to the Promise method of the same name, the provided function is called when the `MaybeAsync` is executed regardless of whether the `Maybe` result is `Nothing` or `Just`.',
              examples: []
            }
          ]
        },
        {
          title: 'Methods passed to the MaybeAsync async/await callback',
          id: 'callback',
          methods: [
            {
              name: 'liftMaybe',
              description:
                'This helper is passed to the function given to the MaybeAsync constructor. It allows you to take a regular Maybe value and lift it to the MaybeAsync context. Awaiting a lifted Maybe will give you the value inside. If the Maybe is Nothing then the function will exit immediately and MaybeAsync will resolve to Nothing after running it.',
              signatureML: 'Maybe a -> MaybeAsyncValue a',
              signatureTS: '<T>(maybe: Maybe<T>): MaybeAsyncValue<T>',
              examples: [
                {
                  input: `MaybeAsync(async ({ liftMaybe }) => {
  const value: number = await liftMaybe(Just(5))
}).run()`,
                  output: 'Promise {<resolved>: Just(5)}'
                }
              ]
            },
            {
              name: 'fromPromise',
              description:
                'This helper is passed to the function given to the MaybeAsync constructor. It allows you to take a Maybe inside a Promise and lift it to the MaybeAsync context. Awaiting a lifted Promise<Maybe> will give you the value inside the Maybe. If the Maybe is Nothing or the Promise is rejected then the function will exit immediately and MaybeAsync will resolve to Nothing after running it.',
              signatureML: 'IO (Maybe a) -> MaybeAsyncValue a',
              signatureTS:
                '<T>(promise: PromiseLike<Maybe<T>>): MaybeAsyncValue<T>',
              examples: [
                {
                  input: `MaybeAsync(async ({ fromPromise }) => {
  const value: number = await fromPromise(Promise.resolve(Just(5)))
}).run()`,
                  output: 'Promise {<resolved>: Just(5)}'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'Either',
      implements: [
        'Setoid',
        'Functor',
        'Apply',
        'Applicative',
        'Alt',
        'Chain',
        'Monad',
        'Foldable',
        'Extend',
        'Bifunctor'
      ],
      description: `Either is a data type with two sides (constructors) - Left and Right. It is most commonly used for error handling as it is very similar to the Maybe type with the only difference being that you can store information about the missing value (an error message for example). By convention, "Right is right", meaning that success is stored on the Right and failure is stored on the Left. It is also important to note that Either is right-biased which means that \`map\`, \`chain\` and other similar methods will operate on the right side.`,
      examples: [
        {
          title: 'How to import',
          content: [`import { Either, Left, Right } from 'purify-ts/Either'`]
        },
        {
          title: 'Without Either',
          content: [
            'const getPort = () => {',
            '    const config: Config | null = getConfig()',
            '',
            '    if (config && config.port) {',
            '        return config.port',
            '    }',
            '',
            `    throw Error("Couldn't parse port from config")`,
            '}',
            '',
            'let port: number',
            '',
            'try {',
            '    port = parseInt(getPort())',
            '} catch (e) {',
            '    loggingService.log(e.message)',
            '    port = 8080',
            '}'
          ]
        },
        {
          title: 'With Either',
          content: [
            'const getPort = () => getConfig() // Maybe makes a great combo with Either',
            '    .chain(x => x.port)',
            `    .toEither(new Error("Couldn't parse port from config"))`,
            '',
            'const port: number = getPort() // Either<Error, number>',
            '    .ifLeft((e) => loggingService.log(e.message))',
            '    .map(parseInt)',
            '    .orDefault(8080)'
          ]
        }
      ],
      guides: [],
      content: [
        {
          title: 'Constructors',
          id: 'constructor',
          methods: [
            {
              name: 'Left',
              description: (
                <div>
                  Constructs a Left. Most commonly represents information about
                  an operation that failed.
                  <br />
                  <Note>
                    When creating Either instances using the Left and Right
                    constructors and returning them from a function please don't
                    forget to add a type annotation to that function.
                    <br />
                    Otherwise TypeScript is not smart enough to figure out the
                    correct return type and you won't be able to use the return
                    value as expected.
                    <br />
                    <Highlight>
                      {`// Inferred type is randomEither: () => Either<never, number> | Either<string, never>
const randomEither = () =>
    Math.random() > 0.5 ? Right(1) : Left('Error')

randomEither().map(x => x)
//             ~~~
// This expression is not callable.
// Each member of the union type ... has signatures,
// but none of those signatures are compatible with each other.`}
                    </Highlight>
                  </Note>
                </div>
              ),
              signatureML: 'a -> Either a b',
              signatureTS: '<L>(value: L): Either<L, never>',
              examples: [
                {
                  input: `Left('Error')`,
                  output: `Left('Error') // Either<string, never>`
                }
              ]
            },
            {
              name: 'Right',
              description:
                'Constructs a Right. Represents a successful result of an operation.',
              signatureML: 'b -> Either a b',
              signatureTS: '<R>(value: R): Either<never, R>',
              examples: [
                {
                  input: 'Right(10)',
                  output: 'Right(10) // Either<never, number>'
                }
              ]
            }
          ]
        },
        {
          title: 'Static methods',
          id: 'static',
          methods: [
            {
              name: 'of',
              description: 'Takes a value and wraps it in a `Right`.',
              signatureML: 'b -> Either a b',
              signatureTS: '<R>(value: R): Either<never, R>',
              examples: [{ input: 'Either.of(5)', output: 'Right(5)' }]
            },
            {
              name: 'lefts',
              description:
                'Takes a list of `Either`s and returns a list of all `Left` values.',
              signatureML: '[Either a b] -> [a]',
              signatureTS: '<L, R>(list: Either<L,R>[]): L[]',
              examples: [
                {
                  input: `Either.lefts([Left('Server error'), Left('Wrong password'), Right('foo@bar.com')])`,
                  output: `['Server error', 'Wrong password']`
                }
              ]
            },
            {
              name: 'rights',
              description:
                'Takes a list of `Either`s and returns a list of all `Right` values.',
              signatureML: '[Either a b] -> [b]',
              signatureTS: '<L, R>(list: Either<L, R>[]): R[]',
              examples: [
                {
                  input: `Either.rights([Right(10), Left('Invalid input'), Right(5)])`,
                  output: '[10, 5]'
                }
              ]
            },
            {
              name: 'encase',
              description:
                'Calls a function and returns a `Right` with the return value or an exception wrapped in a `Left` in case of failure.',
              signatureTS:
                '<L extends Error, R>(throwsF: () => R): Either<L, R>',
              examples: [
                {
                  input: `Either.encase(() => { throw Error('Always fails') })`,
                  output: `Left(new Error('Always fails'))`
                },
                { input: 'Either.encase(() => 10)', output: 'Right(10)' }
              ]
            },
            {
              name: 'sequence',
              description:
                'Turns a list of `Either`s into an `Either` of list.',
              signatureTS: '<L, R>(eithers: Either<L, R>[]): Either<L, R[]>',
              signatureML: '[Either a b] -> Either a [b]',
              examples: [
                {
                  input: 'Either.sequence([Right(1), Right(2)]))',
                  output: 'Right([1, 2])'
                },
                {
                  input: "Either.sequence([Right(1), Left('Error')]))",
                  output: "Left('Error')"
                }
              ]
            },
            {
              name: 'isEither',
              signatureTS: '<L, R>(x: unknown): x is Either<L, R>',
              description: '',
              examples: [
                {
                  input: "Either.isEither('Something')",
                  output: 'false'
                },
                {
                  input: 'Either.isEither(Right(10))',
                  output: 'true'
                }
              ]
            }
          ]
        },
        {
          title: 'Instance methods',
          id: 'instance',
          methods: [
            {
              name: 'isLeft',
              description:
                'Returns true if `this` is `Left`, otherwise it returns false.',
              signatureML: 'Either a b -> Bool',
              signatureTS: '(): boolean',
              examples: [
                { input: `Left('Error').isLeft()`, output: 'true' },
                { input: `Right(10).isLeft()`, output: 'false' }
              ]
            },
            {
              name: 'isRight',
              description:
                'Returns true if `this` is `Right`, otherwise it returns false.',
              signatureML: 'Either a b -> Bool',
              signatureTS: '(): boolean',
              examples: [
                { input: `Left('Error').isRight()`, output: 'false' },
                { input: `Right(10).isRight()`, output: 'true' }
              ]
            },
            {
              name: 'caseOf',
              description:
                'Structural pattern matching for `Either` in the form of a function.',
              signatureTS:
                '<T>(patterns: { Left: (l: L) => T, Right: (r: R) => T } | { _: () => T }): T',
              examples: [
                {
                  input: `Left('Error').caseOf({ Left: x => x, Right: () => 'No error' })`,
                  output: `'Error'`
                },
                {
                  input: `Right(6).caseOf({ Left: _ => 0, Right: x => x + 1 })`,
                  output: '7'
                },
                {
                  input: `Left('Error').caseOf({ _: () => 0 }) // wildcard`,
                  output: '0'
                }
              ]
            },
            {
              name: 'bimap',
              description:
                'Given two functions, maps the value inside `this` using the first if `this` is `Left` or using the second one if `this` is `Right`.',
              signatureML: 'Either a b ~> (a -> c) -> (b -> d) -> Either c d',
              signatureTS:
                '<L2, R2>(f: (value: L) => L2, g: (value: R) => R2): Either<L2, R2>',
              examples: [
                {
                  input: `Left('Error').bimap(x => x + '!', x => x + 1)`,
                  output: `Left('Error!')`
                },
                {
                  input: `Right(5).bimap(x => x + '!', x => x + 1)`,
                  output: `Right(6)`
                }
              ]
            },
            {
              name: 'map',
              description:
                'Maps the `Right` value of `this`, acts like an identity if `this` is `Left`.',
              signatureML: 'Either a b ~> (b -> c) -> Either a c',
              signatureTS: '<R2>(f: (value: R) => R2): Either<L, R2>',
              examples: [
                {
                  input: `Left('Error').map(x => x + 1)`,
                  output: `Left('Error')`
                },
                { input: `Right(5).map(x => x + 1)`, output: `Right(6)` }
              ]
            },
            {
              name: 'mapLeft',
              description:
                'Maps the `Left` value of `this`, acts like an identity if `this` is `Right`.',
              signatureML: 'Either a b ~> (a -> c) -> Either c b',
              signatureTS: '<L2>(f: (value: L) => L2): Either<L2, R>',
              examples: [
                {
                  input: `Left('Error').mapLeft(x => x + '!')`,
                  output: `Left('Error!')`
                },
                { input: `Right(5).mapLeft(x => x + '!')`, output: `Right(5)` }
              ]
            },
            {
              name: 'ap',
              description:
                'Applies a `Right` function over a `Right` value. Returns `Left` if either `this` or the function are `Left`.',
              signatureML: 'Either a b ~> Either a (b -> c) -> Either a c',
              signatureTS:
                '<L2, R2>(other: Either<L2, (value: R) => R2>): Either<L | L2, R2>',
              examples: [
                { input: 'Right(5).ap(Right(x => x + 1))', output: 'Right(6)' },
                {
                  input: `Right(5).ap(Left('Error'))`,
                  output: `Left('Error')`
                },
                {
                  input: `Left('Error').ap(Right(x => x + 1))`,
                  output: `Left('Error')`
                },
                {
                  input: `Left('Error').ap(Left('Function Error'))`,
                  output: `Left('Function Error')`
                }
              ]
            },
            {
              name: 'equals',
              description:
                'Compares `this` to another `Either`, returns false if the constructors or the values inside are different.',
              signatureML: 'Either a b ~> Either a b -> Bool',
              signatureTS: '(other: Either<L, R>): boolean',
              examples: [
                {
                  input: `Left('Error').equals(Left('Error'))`,
                  output: 'true'
                },
                { input: `Right(5).equals(Right(5))`, output: 'true' },
                { input: `Left(10).equals(Right(10))`, output: 'false' },
                { input: `Right(5).equals(Left('Error'))`, output: 'false' }
              ]
            },
            {
              name: 'chain',
              description:
                'Transforms `this` with a function that returns an `Either`. Useful for chaining many computations that may fail.',
              signatureML: 'Either a b ~> (b -> Either a c) -> Either a c',
              signatureTS:
                '<L2, R2>(f: (value: R) => Either<L2, R2>): Either<L | L2, R2>',
              examples: [
                {
                  input: `Left('Error').chain(x => Right(x + 1))`,
                  output: `Left('Error')`
                },
                {
                  input: `Right(5).chain(x => Right(x + 1))`,
                  output: `Right(6)`
                }
              ]
            },
            {
              name: 'chainLeft',
              description:
                'The same as Either#chain but executes the transformation function only if the value is Left. Useful for recovering from errors.',
              signatureML: 'Either a b ~> (a -> Either c b) -> Either c b',
              signatureTS:
                '<L2, R2>(f: (value: L) => Either<L2, R2>): Either<L2, R | R2>',
              examples: [
                {
                  input: `Left('Error').chainLeft(x => Right(''))`,
                  output: `Right('')`
                },
                {
                  input: `Right(5).chainLeft(x => Right(999))`,
                  output: `Right(5)`
                }
              ]
            },
            {
              name: 'join',
              description:
                'Flattens nested Eithers. `e.join()` is equivalent to `e.chain(x => x)`',
              signatureML: 'Either a (Either a b) ~> Either a b',
              signatureTS:
                '<L2, R2>(this: Either<L, Either<L2, R2>>): Either<L | L2, R2>',
              examples: [
                { input: 'Right(Right(5)).join()', output: 'Right(5)' },
                {
                  input: `Left(Left('Error')).join()`,
                  output: `Left(Left('Error'))`
                }
              ]
            },
            {
              name: 'alt',
              description:
                'Returns the first `Right` between `this` and another `Either` or the `Left` in the argument if both `this` and the argument are `Left`.',
              signatureML: 'Either a b ~> Either a b -> Either a b',
              signatureTS: '(other: Either<L, R>): Either<L, R>',
              examples: [
                {
                  input: `Left('Error').alt(Left('Error!'))`,
                  output: `Left('Error!')`
                },
                { input: `Left('Error').alt(Right(5))`, output: `Right(5)` },
                { input: `Right(5).alt(Left('Error'))`, output: `Right(5)` },
                { input: `Right(5).alt(Right(6))`, output: `Right(5)` }
              ]
            },
            {
              name: 'altLazy',
              description: 'Lazy version of `alt`.',
              signatureML: 'Either a b ~> (() -> Either a b) -> Either a b',
              signatureTS: '(other: () => Either<L, R>): Either<L, R>',
              examples: []
            },
            {
              name: 'reduce',
              description:
                'Takes a reducer and an initial value and returns the initial value if `this` is `Left` or the result of applying the function to the initial value and the value inside `this`.',
              signatureML: 'Either a b ~> ((c, b) -> c, c) -> c',
              signatureTS:
                '<T>(reducer: (accumulator: T, value: R) => T, initialValue: T): T',
              examples: [
                {
                  input: 'Right(5).reduce((acc, x) => x * acc, 2)',
                  output: '10'
                },
                {
                  input: `Left('Error').reduce((acc, x) => x * acc, 0)`,
                  output: '0'
                }
              ]
            },
            {
              name: 'extend',
              description:
                "Returns `this` if it's a `Left`, otherwise it returns the result of applying the function argument to `this` and wrapping it in a `Right`.",
              signatureML: 'Either a b ~> (Either a b -> c) -> Either a c',
              signatureTS:
                '<R2>(f: (value: Either<L, R>) => R2): Either<L, R2>',
              examples: [
                {
                  input: `Left('Error').extend(x => x.isRight())`,
                  output: `Left('Error')`
                },
                {
                  input: `Right(5).extend(x => x.isRight())`,
                  output: `Right(true)`
                }
              ]
            },
            {
              name: 'unsafeCoerce',
              description:
                "Returns the value inside `this` if it's a `Right` or either throws the value or a generic exception depending on whether the value is an Error.",
              signatureTS: '(): R',
              examples: [
                { input: 'Right(5).unsafeCoerce()', output: '5' },
                {
                  input: `Left('Error').unsafeCoerce()`,
                  output:
                    '// Uncaught Error: Either#unsafeCoerce was ran on a Left'
                },
                {
                  input: `Left(Error('Something')).unsafeCoerce()`,
                  output: '// Uncaught Error: Something'
                }
              ]
            },
            {
              name: 'orDefault',
              description:
                "Returns the value inside `this` if it's `Right` or a default value if `this` is `Left`.",
              signatureML: 'Either a b ~> b -> b',
              signatureTS: '(defaultValue: R): R',
              examples: [
                { input: `Left('Error').orDefault(0)`, output: '0' },
                { input: `Right(5).orDefault(0)`, output: '5' }
              ]
            },
            {
              name: 'leftOrDefault',
              description:
                "Returns the value inside `this` if it's `Left` or a default value if `this` is `Right`.",
              signatureML: 'Either a b ~> a -> a',
              signatureTS: '(defaultValue: L): L',
              examples: [
                {
                  input: `Left('Error').leftOrDefault('No error')`,
                  output: `'Error'`
                },
                {
                  input: `Right(5).leftOrDefault('No error')`,
                  output: `'No error'`
                }
              ]
            },
            {
              name: 'orDefaultLazy',
              description:
                'Lazy version of `orDefault`. Takes a function that returns the default value, that function will be called only if `this` is `Left`.',
              signatureML: 'Either a b ~> (() -> b) -> b',
              signatureTS: '(defaultValue: R): R',
              examples: [
                { input: `Left('Error').orDefault(() => 0)`, output: '0' },
                {
                  input: `Right(5).orDefault(() => expensiveComputation())`,
                  output: '5 // expensiveComputation is never called'
                }
              ]
            },
            {
              name: 'leftOrDefaultLazy',
              description:
                'Lazy version of `leftOrDefault`. Takes a function that returns the default value, that function will be called only if `this` is `Right`.',
              signatureML: 'Either a b ~> (() -> a) -> a',
              signatureTS: '(defaultValue: L): L',
              examples: [
                {
                  input: `Left('Error').leftOrDefault(() => 'No error')`,
                  output: `'Error'`
                },
                {
                  input: `Right(5).leftOrDefault(() => 'No error')`,
                  output: `'No error'`
                }
              ]
            },
            {
              name: 'toMaybe',
              description:
                "Constructs a `Just` with the value of `this` if it's `Right` or a `Nothing` if `this` is `Left`.",
              signatureML: 'Either a b ~> Maybe b',
              signatureTS: '(): Maybe<R>',
              examples: [
                { input: `Left('Error').toMaybe()`, output: 'Nothing' },
                { input: `Right(5).toMaybe()`, output: 'Just(5)' }
              ]
            },
            {
              name: 'leftToMaybe',
              description:
                "Constructs a `Just` with the value of `this` if it's `Left` or a `Nothing` if `this` is `Right`.",
              signatureML: 'Either a b ~> Maybe a',
              signatureTS: '(): Maybe<L>',
              examples: [
                {
                  input: `Left('Error').leftToMaybe()`,
                  output: `Just('Error')`
                },
                { input: `Right(5).leftToMaybe()`, output: 'Nothing' }
              ]
            },
            {
              name: 'ifLeft',
              description:
                'Runs an effect if `this` is `Left`, returns `this` to make chaining other methods possible.',
              signatureTS: '(effect: (value: L) => any): this',
              examples: [
                {
                  input: `Left('Error').ifLeft((err) => console.log(err))`,
                  output: `// Error`
                },
                {
                  input: `Right(5).ifLeft(() => console.log('Unexpected error'))`,
                  output: ''
                }
              ]
            },
            {
              name: 'ifRight',
              description:
                'Runs an effect if `this` is `Right`, returns `this` to make chaining other methods possible.',
              signatureTS: '(effect: (value: R) => any): this',
              examples: [
                {
                  input: `Left('Error').ifRight((result) => console.log(result))`,
                  output: ``
                },
                {
                  input: `Right(5).ifRight((result) => console.log(result))`,
                  output: '// 5'
                }
              ]
            },
            {
              name: 'extract',
              description: 'Extracts the value out of `this`.',
              signatureTS: '(): L | R',
              examples: [
                { input: 'Right(5).extract()', output: '5' },
                { input: `Left('Error').extract()`, output: `'Error'` }
              ]
            },
            {
              name: 'swap',
              description:
                'Returns `Right` if `this` is `Left` and vice versa.',
              signatureTS: '(): Either<R, L>',
              signatureML: 'Either a b ~> Either b a',
              examples: [
                { input: 'Right(5).swap()', output: 'Left(5)' },
                { input: 'Left(5).swap()', output: 'Right(5)' }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'EitherAsync',
      implements: ['Functor', 'Bifunctor', 'Chain', 'Apply', 'Alt', 'Extend'],
      guides: [
        {
          title: 'MaybeAsync and EitherAsync for Haskellers',
          link: '/guides/maybeasync-eitherasync-for-haskellers'
        },
        {
          title: 'EitherAsync used in an example repo',
          link: 'https://github.com/gigobyte/ts-react-express-starter/tree/main/server/src'
        }
      ],
      description: (
        <div>
          {
            "It is recommended to have your promises resolve to Either wherever error handling is needed instead of rejecting them and handling errors in the catch method, because unfortunately errors in Promises are not typechecked. EitherAsync lets you do that seamlessly, it's a wrapper (and hopefully a drop-in replacement) of"
          }{' '}
          <HL>{'Promise<Either<L, R>>'}</HL>{' '}
          {
            'that allows you to process asynchronous values while also having error handling via Either. EitherAsync even implements'
          }
          <HL>PromiseLike</HL>
          {', so you want await it just like a regular Promise.'}
          <br />
          <br />
          {
            '\nThat said, there are 2 ways of composing EitherAsync values, just like there are two ways of working with Promises - async/await and chaining together transformations.  If you squint hard you can see that EitherAsync tries really hard to be a '
          }{' '}
          <a href="https://wiki.haskell.org/Monad_Transformers_Explained">
            monad transformer
          </a>
          {
            ', which is true, but constraining it to Promises brought a tremendous amount of value and the trade-off is worth it.'
          }
        </div>
      ),
      examples: [
        {
          title: 'How to import',
          content: [`import { EitherAsync } from 'purify-ts/EitherAsync'`]
        },
        {
          title: 'Given the following functions, examples below',
          content: [
            `function validateRequest(req: Request): Either<Error, DeleteUserRequest>`,
            `function getUser(userId: number):       Promise<Either<Error, User>>`,
            `function deleteUserDb(user: User):      Promise<Id<User>>`
          ]
        },
        {
          title: 'Example usage (async/await)',
          content: [
            'const deleteUser = (req): EitherAsync<Error, Id<User>> =>',
            '    EitherAsync(async ({ liftEither, fromPromise, throwE }) => {',
            '       // when you have Either<L, R> and you want to get R out',
            '       const request = await liftEither(validateRequest(req))',
            '',
            '       try {',
            '           // when you have Promise<Either<L, R>> and you want to get R out',
            '           const user = await fromPromise(getUser(request.userId))',
            '       } catch {',
            '           throwE(Error.UserDoesNotExist)',
            '       }',
            '',
            '       return deleteUserDb(user)',
            '    })',
            '',
            'const promise: Promise<Either<Error, Id<User>>> =',
            '   deleteUser(req).run()'
          ]
        },
        {
          title: 'Example usage (chaining)',
          content: [
            'const deleteUser = (req): EitherAsync<Error, Id<User>> =>',
            '    EitherAsync.liftEither(validateRequest(req))',
            '        // when you have ',
            '        // Promise<Either<L, R>> or EitherAsync<L, R> (both work)',
            '        // and you want to chain it',
            '        .chain(request => getUser(request.userId))',
            '        .mapLeft(_     => Error.UserDoesNotExist)',
            '',
            '        // when you have Promise<T> and you want to chain it',
            '        .chain(user    => EitherAsync(() => deleteUserDb(user)))',
            '',
            'const promise: Promise<Either<Error, Id<User>>> =',
            '   deleteUser(req).run()'
          ]
        }
      ],
      content: [
        {
          title: 'Constructors',
          id: 'constructor',
          methods: [
            {
              name: 'EitherAsync',
              description:
                'Constructs an EitherAsync object from a function that takes an object full of helpers that let you lift things into the EitherAsync context and returns a Promise.',
              examples: [
                {
                  input:
                    'EitherAsync<Error, number>(({ liftEither, fromPromise }) => Promise.resolve(5))',
                  output: 'EitherAsync<Error, number>'
                }
              ],
              signatureML: '(EitherAsyncHelpers -> IO a) -> EitherAsync a b',
              signatureTS: `<L, R>(runPromise: (helpers: EitherAsyncHelpers<L>) => PromiseLike<R>): EitherAsync<L, R>`
            }
          ]
        },
        {
          title: 'Static methods',
          id: 'static',
          methods: [
            {
              name: 'fromPromise',
              description:
                'Constructs an EitherAsync object from a function that returns an Either wrapped in a Promise. You would rarely need to do that since most of the EitherAsync API works with both EitherAsync and Promise values.',
              examples: [
                {
                  input:
                    'EitherAsync.fromPromise(() => Promise.resolve(Right(5)))',
                  output: 'EitherAsync<never, number>'
                }
              ],
              signatureML: '(() -> IO (Either a b)) -> EitherAsync a b',
              signatureTS: `<L, R>(f: () => PromiseLike<Either<L, R>>): EitherAsync<L, R>`
            },
            {
              name: 'liftEither',
              description: 'Constructs an EitherAsync object from an Either.',
              examples: [
                {
                  input: 'EitherAsync.liftEither(Right(5))',
                  output: 'EitherAsync<never, number>'
                }
              ],
              signatureML: 'Either a b -> EitherAsync a b',
              signatureTS: `<L, R>(either: Either<L, R>): EitherAsync<L, R>`
            },
            {
              name: 'lefts',
              description:
                'Takes a list of `EitherAsync`s and returns a Promise that will resolve with all `Left` values. Internally it uses `Promise.all` to wait for all results.',
              signatureML: '[EitherAsync a b] -> [IO a]',
              signatureTS: '<L, R>(list: EitherAsync<L, R>[]): Promise<L[]>',
              examples: [
                {
                  input: `EitherAsync.lefts([
  EitherAsync.liftEither(Left('Server error')),
  EitherAsync.liftEither(Left('Wrong password')),
  EitherAsync(async () => 'foo@bar.com')
])`,
                  output: `Promise {<resolved>: ['Server error', 'Wrong password']}`
                }
              ]
            },
            {
              name: 'rights',
              description:
                'Takes a list of `EitherAsync`s and returns a Promise that will resolve with all `Right` values. Internally it uses `Promise.all` to wait for all results.',
              signatureML: '[EitherAsync a b] -> [IO b]',
              signatureTS: '<L, R>(list: Either<L, R>[]): R[]',
              examples: [
                {
                  input: `EitherAsync.rights([
  EitherAsync(async () => 10),
  EitherAsync.liftEither(Left('Invalid input')),
  EitherAsync(async () => 5)
])`,
                  output: 'Promise {<resolved>: [10, 5]}'
                }
              ]
            },
            {
              name: 'sequence',
              description:
                'Turns a list of `EitherAsync`s into an `EitherAsync` of list. The returned `Promise` will be rejected as soon as a single `EitherAsync` resolves to a `Left`, it will not wait for all Promises to resolve and since `EitherAsync` is lazy, unlike `Promise`, the remaining async operations will not be executed at all.',
              signatureTS:
                '<L, R>(eas: EitherAsync<L, R>[]): EitherAsync<L, R[]>',
              signatureML: '[EitherAsync a b] -> EitherAsync a [b]',
              examples: [
                {
                  input:
                    'EitherAsync.sequence([EitherAsync(async () => 1), EitherAsync(async () => 2)).run()',
                  output: 'Promise {<resolved>: Right([1, 2])}'
                },
                {
                  input:
                    "EitherAsync.sequence([EitherAsync(async () => 1), EitherAsync(() => { throw 'Error' })])).run()",
                  output: "Promise {<resolved>: Left('Error')}"
                }
              ]
            },
            {
              name: 'all',
              description:
                'The same as `EitherAsync.sequence`, but it will run all async operations at the same time rather than sequentially.',
              signatureTS:
                '<L, R>(eas: EitherAsync<L, R>[]): EitherAsync<L, R[]>',
              signatureML: '[EitherAsync a b] -> EitherAsync a [b]',
              examples: []
            }
          ]
        },
        {
          title: 'Instance methods',
          id: 'instance',
          methods: [
            {
              name: 'run',
              signatureML: 'EitherAsync a b ~> IO (Either a b)',
              signatureTS: 'run(): Promise<Either<L, R>>',
              description: (
                <div>
                  <b>IMPORTANT: </b> The Promise returned from `run` will never
                  be rejected, so there's no point in calling `catch` on it. If
                  something goes wrong, here's how it's going to be handled:
                  <ul>
                    <li>
                      If any of the computations inside EitherAsync resolved to
                      a Left, `run` will return a Promise resolved to that Left.
                    </li>
                    <li>
                      If any of the promises were to be rejected then `run` will
                      return a Promise resolved to a Left with the rejection
                      value inside.
                    </li>
                    <li>
                      If an exception is thrown then `run` will return a Promise
                      resolved to a Left with the exception inside.
                    </li>
                    <li>
                      If none of the above happen then a promise resolved to the
                      returned value wrapped in a Right will be returned.
                    </li>
                  </ul>
                </div>
              ),
              examples: [
                {
                  input: `EitherAsync<string, never>(({ liftEither }) => liftEither(Left('Error'))).run()`,
                  output: `Promise {<resolved>: Left('Error')}`
                },
                {
                  input: `EitherAsync<string, never>(() => Promise.reject('Something happened')).run()`,
                  output: `Promise {<resolved>: Left('Something happened')}`
                },
                {
                  input: `EitherAsync<Error, never>(() => { throw Error('Something happened') }).run()`,
                  output: `Promise {<resolved>: Left(Error('Something happened'))}`
                },
                {
                  input:
                    'EitherAsync<string, number>(() => Promise.resolve(5)).run()',
                  output: 'Promise {<resolved>: Right(5)}'
                }
              ]
            },
            {
              name: 'bimap',
              description:
                'Given two functions, maps the value that the Promise inside `this` resolves to using the first if it is `Left` or using the second one if it is `Right`.',
              signatureML:
                'EitherAsync a b ~> (a -> c) -> (b -> d) -> EitherAsync c d',
              signatureTS:
                '<L2, R2>(f: (value: L) => L2, g: (value: R) => R2): EitherAsync<L2, R2>',
              examples: [
                {
                  input:
                    'EitherAsync(() => Promise.resolve(5)).bimap(identity, x => x + 1).run()',
                  output: 'Promise {<resolved>: Right(6)}'
                },
                {
                  input:
                    'EitherAsync(() => Promise.reject(5)).bimap(x => x + 1, identity).run()',
                  output: 'Promise {<resolved>: Left(6)}'
                }
              ]
            },
            {
              name: 'map',
              description:
                "Transforms the `Right` value of `this` with a given function. If the EitherAsync that is being mapped resolves to a Left then the mapping function won't be called and `run` will resolve the whole thing to that Left, just like the regular Either#map.",
              signatureML: 'EitherAsync a b ~> (b -> c) -> EitherAsync a c',
              signatureTS: '<R2>(f: (value: R) => R2): EitherAsync<L, R2>',
              examples: [
                {
                  input:
                    'EitherAsync(() => Promise.resolve(5)).map(x => x + 1).run()',
                  output: 'Promise {<resolved>: Right(6)}'
                }
              ]
            },
            {
              name: 'mapLeft',
              description:
                'Maps the `Left` value of `this`, acts like an identity if `this` is `Right`.',
              signatureML: 'EitherAsync a b ~> (a -> c) -> EitherAsync c b',
              signatureTS: '<L2>(f: (value: L) => L2): EitherAsync<L2, R>',
              examples: [
                {
                  input:
                    'EitherAsync(() => throw new Error()).mapLeft(_ => ({ status: 500 })).run()',
                  output: 'Promise {<resolved>: Left({ status: 500 })}'
                },
                {
                  input:
                    'EitherAsync(() => Promise.resolve(5)).mapLeft(x => x + 1).run()',
                  output: 'Promise {<resolved>: Right(5)}'
                }
              ]
            },
            {
              name: 'ap',
              description:
                'Applies a `Right` function wrapped in `EitherAsync` over a future `Right` value. Returns `Left` if either the `this` resolves to a `Left` or the function is `Left`.',
              signatureTS:
                '<L2, R2>(other: PromiseLike<Either<L2, (value: R) => R2>>): EitherAsync<L | L2, R2>',
              examples: []
            },
            {
              name: 'chain',
              description:
                'Transforms `this` with a function that returns a `EitherAsync` or another `PromiseLike`. Behaviour is the same as the regular Either#chain.',
              signatureTS:
                '<L2, R2>(f: (value: R) => PromiseLike<Either<L2, R2>>): EitherAsync<L | L2, R2>',
              examples: [
                {
                  input: `EitherAsync(async () => 5).chain(x => EitherAsync(async () => x + 1)).run()`,
                  output: 'Promise {<resolved>: Right(6)}'
                },
                {
                  input: `EitherAsync(async () => 5).chain(async (x) => Right(x + 1)).run()`,
                  output: 'Promise {<resolved>: Right(6)}'
                }
              ]
            },
            {
              name: 'chainLeft',
              description:
                'The same as EitherAsync#chain but executes the transformation function only if the value is Left. Useful for recovering from errors asynchronously.',
              signatureTS:
                '<L2, R2>(f: (value: L) => PromiseLike<Either<L2, R2>>): EitherAsync<L2, R | R2>',
              examples: [
                {
                  input: `EitherAsync(({ throwE }) => throwE(500))
  .chainLeft(x => EitherAsync(() => Promise.resolve(6)))
  .run()`,
                  output: 'Promise {<resolved>: Right(6)}'
                }
              ]
            },
            {
              name: 'join',
              description:
                'Flattens nested `EitherAsync`s. `e.join()` is equivalent to `e.chain(x => x)`.',
              signatureML: 'EitherAsync a (EitherAsync a b) ~> EitherAsync a b',
              signatureTS:
                '<L2, R2>(this: EitherAsync<L, EitherAsync<L2, R2>>): EitherAsync<L | L2, R2>',
              examples: []
            },
            {
              name: 'alt',
              description:
                'Returns the first `Right` between the future value of `this` and another `EitherAsync` or the `Left` in the argument if both `this` and the argument resolve to `Left`.',
              signatureML:
                'EitherAsync a b ~> EitherAsync a b -> EitherAsync a b',
              signatureTS: '(other: EitherAsync<L, R>): EitherAsync<L, R>',
              examples: []
            },
            {
              name: 'extend',
              description:
                'Returns `this` if it resolves to a `Left`, otherwise it returns the result of applying the function argument to `this` and wrapping it in a `Right`.',
              signatureML:
                'EitherAsync a b ~> (EitherAsync a b -> c) -> EitherAsync a c',
              signatureTS:
                '<R2>(f: (value: EitherAsync<L, R>) => R2): EitherAsync<L, R2>',
              examples: []
            },
            {
              name: 'orDefault',
              description:
                "Returns a Promise that resolves to the value inside `this` if it's `Right` or a default value if `this` is `Left`.",
              signatureML: 'EitherAsync a b ~> b -> b',
              signatureTS: '(defaultValue: R): Promise<R>',
              examples: []
            },
            {
              name: 'leftOrDefault',
              description:
                "Returns a Promise that resolves to the value inside `this` if it's `Left` or a default value if `this` is `Right`.",
              signatureML: 'EitherAsync a b ~> a -> IO a',
              signatureTS: '(defaultValue: L): Promise<L>',
              examples: []
            },
            {
              name: 'toMaybeAsync',
              description:
                'Converts `this` to a MaybeAsync, discarding any error values.',
              signatureML: 'EitherAsync a b ~> MaybeAsync b',
              signatureTS: '(): MaybeAsync<R>',
              examples: []
            },
            {
              name: 'swap',
              description:
                'Returns `Right` if `this` is `Left` and vice versa.',
              signatureTS: '(): EitherAsync<R, L>',
              signatureML: 'EitherAsync a b ~> EitherAsync b a',
              examples: [
                {
                  input:
                    'EitherAsync<string, number>(() => Promise.resolve(5)).swap().run()',
                  output: 'Promise {<resolved>: Left(5)}'
                },
                {
                  input: `EitherAsync(() => Promise.reject('Something happened')).swap().run()`,
                  output: `Promise {<resolved>: Right('Something happened')}`
                }
              ]
            },
            {
              name: 'ifLeft',
              description:
                'Runs an effect if `this` is `Left`, returns `this` to make chaining other methods possible.',
              signatureTS: '(effect: (value: L) => any): EitherAsync<L, R>',
              examples: [
                {
                  input: `EitherAsync.liftEither(Left('Error')).ifLeft((err) => console.log(err))`,
                  output: `// Error`
                },
                {
                  input: `EitherAsync.liftEither(Right(5)).ifLeft(() => console.log('Unexpected error'))`,
                  output: ''
                }
              ]
            },
            {
              name: 'ifRight',
              description:
                'Runs an effect if `this` is `Right`, returns `this` to make chaining other methods possible.',
              signatureTS: '(effect: (value: R) => any): EitherAsync<L, R>',
              examples: [
                {
                  input: `EitherAsync.liftEither(Left('Error')).ifRight((result) => console.log(result))`,
                  output: ``
                },
                {
                  input: `EitherAsync.liftEither(Right(5)).ifRight((result) => console.log(result))`,
                  output: '// 5'
                }
              ]
            },

            {
              name: 'finally',
              description:
                'Similar to the Promise method of the same name, the provided function is called when the `EitherAsync` is executed regardless of whether the `Either` result is `Left` or `Right`.',
              signatureTS: '(effect: () => any): EitherAsync<L, R>',
              examples: [
                {
                  input: `EitherAsync.liftEither(Left('Error')).finally(() => console.log('It runs!))`,
                  output: `// It runs!`
                },
                {
                  input: `EitherAsync.liftEither(Right(5)).finally(() => console.log('It runs!))`,
                  output: '// It runs!'
                }
              ]
            },
            {
              name: 'void',
              signatureTS: '(): EitherAsync<L, void>',
              description:
                'Useful if you are not interested in the result of an operation.',
              examples: []
            }
          ]
        },
        {
          title: 'Methods passed to the EitherAsync async/await callback',
          id: 'callback',
          methods: [
            {
              name: 'liftEither',
              description:
                'This helper is passed to the function given to the EitherAsync constructor. It allows you to take a regular Either value and lift it to the EitherAsync context. Awaiting a lifted Either will give you the `Right` value inside. If the Either is Left then the function will exit immediately and EitherAsync will resolve to that Left after running it.',
              signatureML: 'Either a b -> EitherAsyncValue b',
              signatureTS: '<L, R>(either: Either<L, R>): EitherAsyncValue<R>',
              examples: [
                {
                  input: `EitherAsync(async ({ liftEither }) => {
  const value: number = await liftEither(Right(5))
}).run()`,
                  output: 'Promise {<resolved>: Right(5)}'
                }
              ]
            },
            {
              name: 'fromPromise',
              description:
                'This helper is passed to the function given to the EitherAsync constructor. It allows you to take an Either inside a Promise and lift it to the EitherAsync context. Awaiting a lifted Promise<Either> will give you the `Right` value inside the Either. If the Either is Left or the Promise is rejected then the function will exit immediately and MaybeAsync will resolve to that Left or the rejection value after running it.',
              signatureML: 'IO (Either a b) -> EitherAsyncValue b',
              signatureTS:
                '<L, R>(promise: PromiseLike<Either<L, R>>): EitherAsyncValue<R>',
              examples: [
                {
                  input: `EitherAsync(async ({ fromPromise }) => {
  const value: number = await fromPromise(Promise.resolve(Right(5)))
}).run()`,
                  output: 'Promise {<resolved>: Right(5)}'
                }
              ]
            },
            {
              name: 'throwE',
              description:
                'This helper is passed to the function given to the EitherAsync constructor. A type safe version of throwing an exception. Unlike the Error constructor, which will take anything, `throwE` only accepts values of the same type as the Left part of the Either.',
              signatureTS: '(error: L): never',
              examples: [
                {
                  input: `EitherAsync<string, number>(async ({ liftEither, throwE })
  const value: number = await liftEither(Right(5))
  throwE('Test')
  return value
}).run()`,
                  output: `Promise {<resolved>: Left('Test')}`
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'Tuple',
      implements: ['Setoid', 'Functor', 'Bifunctor', 'Apply'],
      description: `Tuple, also known as Pair, is a data type containing two values. You can think of it as an immutable array of only two elements, but unlike arrays (which are commonly homogeneous), the two values inside can be of different types.`,
      examples: [
        {
          title: 'How to import',
          content: [`import { Tuple } from 'purify-ts/Tuple'`]
        }
      ],
      guides: [],
      content: [
        {
          title: 'Constructors',
          id: 'constructor',
          methods: [
            {
              name: 'Tuple',
              description: 'Constructs a tuple.',
              signatureML: 'a -> b -> (a, b)',
              signatureTS: '<F, S>(fst: F, snd: S): Tuple<F, S>',
              examples: [
                {
                  input: 'Tuple(1, true)',
                  output: 'Tuple(1, true) // Tuple<number, boolean>'
                }
              ]
            }
          ]
        },
        {
          title: 'Static methods',
          id: 'static',
          methods: [
            {
              name: 'fromArray',
              description:
                'Constructs a tuple from an array with two elements.',
              signatureTS: '<F, S>([fst, snd]: [F, S]): Tuple<F, S>',
              examples: [
                { input: 'Tuple.fromArray([5, 10])', output: 'Tuple(5, 10)' }
              ]
            },
            {
              name: 'fanout',
              description:
                'Applies two functions over a single value and constructs a tuple from the results.',
              signatureML: '(a -> b) -> (a -> c) -> a -> (b, c)',
              signatureTS:
                '<F, S, T>(f: (value: T) => F, g: (value: T) => S, value: T): Tuple<F, S>',
              examples: [
                {
                  input: `Tuple.fanout(x => x[0], x => x.length, 'sss')`,
                  output: `Tuple('s', 3)`
                },
                {
                  input: `Tuple.fanout(x => x[0], x => x.length)('sss')`,
                  output: `Tuple('s', 3)`
                }
              ]
            }
          ]
        },
        {
          title: 'Instance methods',
          id: 'instance',
          methods: [
            {
              name: '[Symbol.iterator]',
              description:
                '`Tuple` implements the Iterator and ArrayLike interfaces, which means that you can destructure tuples like you would destructure arrays.',
              examples: [
                {
                  input: `const [ fst, snd ] = Tuple(1, 'str')`,
                  output:
                    '// Types are preserved - fst has type of number, snd has type of string'
                }
              ]
            },
            {
              name: 'fst',
              description: 'Returns the first value of `this`.',
              signatureML: '(a, b) ~> a',
              signatureTS: '(): F',
              examples: [{ input: 'Tuple(5, 10).fst()', output: '5' }]
            },
            {
              name: 'snd',
              description: 'Returns the second value of `this`.',
              signatureML: '(a, b) ~> b',
              signatureTS: '(): S',
              examples: [{ input: 'Tuple(5, 10).snd()', output: '10' }]
            },
            {
              name: 'equals',
              description:
                'Compares the values inside `this` and another tuple.',
              signatureML: '(a, b) ~> (a, b) -> Bool',
              signatureTS: 'other: Tuple<F, S>): boolean',
              examples: [
                { input: 'Tuple(5, 10).equals(Tuple(5, 10))', output: 'true' },
                { input: `Tuple(5, 'foo').equals(5, 'bar')`, output: 'false' }
              ]
            },
            {
              name: 'bimap',
              description:
                'Transforms the two values inside `this` with two mapper functions.',
              signatureML: '(a, b) ~> (a -> c) -> (b -> d) -> (c, d)',
              signatureTS:
                '<F2, S2>(f: (fst: F) => F2, g: (snd: S) => S2): Tuple<F2, S2>',
              examples: [
                {
                  input: `Tuple(1, 'apple').bimap(x => x + 1, x => x + 's')`,
                  output: `Tuple(2, 'apples')`
                }
              ]
            },
            {
              name: 'map',
              description: 'Applies a function to the second value of `this`.',
              signatureML: '(a, b) ~> (b -> c) -> (a, c)',
              signatureTS: '<S2>(f: (snd: S) => S2): Tuple<F, S2>',
              examples: [
                {
                  input: `Tuple('configured', false).map(x => !x)`,
                  output: `Tuple('configured', true)`
                }
              ]
            },
            {
              name: 'mapFirst',
              description: 'Applies a function to the first value of `this`.',
              signatureML: '(a, b) ~> (a -> c) -> (c, b)',
              signatureTS: '<F2>(f: (fst: F) => F2): Tuple<F2, S>',
              examples: [
                {
                  input: `Tuple(2, 'items').mapFirst(x => x + 1)`,
                  output: `Tuple(3, 'items')`
                }
              ]
            },
            {
              name: 'ap',
              description:
                'Applies the second value of a tuple to the second value of `this`.',
              signatureML: '(a, b) ~> (c, (b -> d)) -> (a, d)',
              signatureTS:
                '<T, S2>(f: Tuple<T, (value: S) => S2>): Tuple<F, S2>',
              examples: [
                {
                  input: `Tuple(5, 10).ap(Tuple('increment', x => x + 1))`,
                  output: `Tuple(5, 11)`
                }
              ]
            },
            {
              name: 'reduce',
              description:
                'A somewhat arbitrary implementation of Foldable for Tuple, the reducer will be passed the initial value and the second value inside `this` as arguments.',
              signatureML: '(a, b) ~> (b -> a -> b) -> b -> b',
              signatureTS:
                '<T>(reducer: (accumulator: T, value: S) => T, initialValue: T): T',
              examples: [
                {
                  input: `Tuple(5, 10).reduce((acc, x) => acc + x, 10)`,
                  output: '20'
                }
              ]
            },
            {
              name: 'swap',
              description: 'Swaps the values inside `this`.',
              signatureML: '(a, b) ~> (b, a)',
              signatureTS: '(): Tuple<S, F>',
              examples: [{ input: 'Tuple(0, 1).swap()', output: 'Tuple(1, 0)' }]
            },
            {
              name: 'toArray',
              description:
                'Returns an array with 2 elements - the values inside `this`.',
              signatureTS: '(): [F, S]',
              examples: [
                {
                  input: `Tuple('username', true).toArray()`,
                  output: `['username', true]`
                }
              ]
            },
            {
              name: 'some',
              description:
                'Tests whether at least one element in the tuple passes the test implemented by the provided function.',
              signatureTS: '(pred: (value: F | S) => boolean): boolean',
              signatureML: '(a, a) ~> (a -> Bool) -> Bool',
              examples: []
            },
            {
              name: 'every',
              description:
                'Tests whether both elements in the tuple pass the test implemented by the provided function.',
              signatureTS: '(pred: (value: F | S) => boolean): boolean',
              signatureML: '(a, a) ~> (a -> Bool) -> Bool',
              examples: []
            }
          ]
        }
      ]
    },
    {
      name: 'NonEmptyList',
      implements: [],
      description: `A type which represents a list that is not empty. NonEmptyList has no runtime, during execution it's a regular array. This gives not only performance benefits, but it also allows you to use Array and NonEmptyList interchangeably - you can pass a NonEmptyList to any function that expects an Array (this includes access to all Array.prototype methods like map and filter for free).`,
      examples: [
        {
          title: 'How to import',
          content: [`import { NonEmptyList } from 'purify-ts/NonEmptyList'`]
        }
      ],
      guides: [],
      content: [
        {
          title: 'Constructors',
          id: 'constructor',
          methods: [
            {
              name: 'NonEmptyList',
              signatureTS:
                '<T extends NonEmptyListCompliant<T[number]>>(list: T): NonEmptyList<T[number]>',
              description:
                'Typecasts an array with at least one element into a `NonEmptyList`. Works only if the compiler can confirm that the array has one or more elements.',
              examples: [
                {
                  input: 'NonEmptyList([1])',
                  output: '// NonEmptyList<number>'
                },
                { input: 'NonEmptyList([])', output: '// Compiler error' }
              ]
            }
          ]
        },
        {
          title: 'Static methods',
          id: 'static',
          methods: [
            {
              name: 'fromArray',
              description:
                'Returns a `Just NonEmptyList` if the parameter has one or more elements, otherwise it returns `Nothing`.',
              signatureML: '[a] -> Maybe (NonEmptyList a)',
              signatureTS: '<T>(source: T[]): Maybe<NonEmptyList<T>>',
              examples: [
                {
                  input: 'NonEmptyList.fromArray([1])',
                  output: 'Just(NonEmptyList([1]))'
                },
                { input: 'NonEmptyList.fromArray([])', output: 'Nothing' }
              ]
            },
            {
              name: 'fromTuple',
              description: 'Converts a `Tuple` to a `NonEmptyList`.',
              signatureTS: '<T, U>(source: Tuple<T, U>): NonEmptyList<T | U>',
              examples: [
                {
                  input: 'NonEmptyList.fromTuple(Tuple(1, 2))',
                  output: 'NonEmptyList([1, 2])'
                }
              ]
            },
            {
              name: 'unsafeCoerce',
              description:
                'Typecasts any array into a `NonEmptyList`, but throws an exception if the array is empty. Use `fromArray` as a safe alternative.',
              signatureTS: '<T>(source: T[]): NonEmptyList<T>',
              examples: [
                {
                  input: 'NonEmptyList.unsafeCoerce([])',
                  output:
                    '// Uncaught Error: NonEmptyList#unsafeCoerce was ran on an empty array'
                },
                {
                  input: 'NonEmptyList.unsafeCoerce([1])',
                  output: '// NonEmptyList<number>'
                }
              ]
            },
            {
              name: 'isNonEmpty',
              signatureML: '[a] -> Bool',
              signatureTS: '<T>(list: T[]): list is NonEmptyList<T>',
              description:
                'Returns true and narrows the type if the passed array has one or more elements.',
              examples: [
                { input: 'NonEmptyList.isNonEmpty([1])', output: 'true' }
              ]
            },
            {
              name: 'head',
              signatureML: 'NonEmptyList a -> a',
              signatureTS: '<T>(list: NonEmptyList<T>): T',
              description: `The same function as \`List#head\`, but it doesn't return a Maybe as a NonEmptyList will always have a head.`,
              examples: []
            },
            {
              name: 'last',
              signatureML: 'NonEmptyList a -> a',
              signatureTS: '<T>(list: NonEmptyList<T>): T',
              description: `The same function as \`List#last\`, but it doesn't return a Maybe as a NonEmptyList will always have a last element.`,
              examples: []
            },
            {
              name: 'tail',
              signatureML: 'NonEmptyList a -> [a]',
              signatureTS: '<T>(list: NonEmptyList<T>): T[]',
              description: `The same function as \`List#tail\`, but it doesn't return a Maybe as a NonEmptyList will always have a tail (although it may be of length 0).`,
              examples: []
            }
          ]
        }
      ]
    }
  ],
  utils: [
    {
      name: 'List',
      description:
        'This module contains type-safe functions for working with arrays.',
      example: {
        import: `import { List } from 'purify-ts/List'`
      },
      content: [
        {
          title: 'Exports',
          id: 'export',
          methods: [
            {
              name: 'at',
              description: 'Returns the element at a given index of a list.',
              signatureML: 'Int -> [a] -> Maybe a',
              signatureTS: '<T>(index: number, list: T[]): Maybe<T>',
              examples: [
                { input: 'List.at(0, [1, 2])', output: 'Just(1)' },
                { input: 'List.at(2, [1, 2])', output: 'Nothing' }
              ]
            },
            {
              name: 'head',
              description: `Returns Just the first element of an array or Nothing if there is none. If you don't want to work with a Maybe but still keep type safety, check out \`NonEmptyList\`.`,
              signatureML: '[a] -> Maybe a',
              signatureTS: '<T>(list: T[]): Maybe<T>',
              examples: [
                { input: 'List.head([1])', output: 'Just(1)' },
                { input: 'List.head([])', output: 'Nothing' }
              ]
            },
            {
              name: 'last',
              description:
                'Returns Just the last element of an array or Nothing if there is none.',
              signatureML: '[a] -> Maybe a',
              signatureTS: '<T>(list: T[]): Maybe<T>',
              examples: [
                { input: 'List.last([1, 2, 3])', output: 'Just(3)' },
                { input: 'List.last([])', output: 'Nothing' }
              ]
            },
            {
              name: 'tail',
              description: 'Returns all elements of an array except the first.',
              signatureML: '[a] -> Maybe [a]',
              signatureTS: '<T>(list: T[]): Maybe<T[]>',
              examples: [
                { input: 'List.tail([1, 2, 3])', output: 'Just([2, 3])' },
                { input: 'List.tail([1])', output: 'Just([])' },
                { input: 'List.tail([])', output: 'Nothing' }
              ]
            },
            {
              name: 'init',
              description: 'Returns all elements of an array except the last.',
              signatureML: '[a] -> Maybe [a]',
              signatureTS: ' <T>(list: T[]): Maybe<T[]>',
              examples: [
                { input: 'List.init([1, 2, 3])', output: 'Just([1, 2])' },
                { input: 'List.init([1])', output: 'Just([])' },
                { input: 'List.init([])', output: 'Nothing' }
              ]
            },
            {
              name: 'find',
              description:
                'Returns the first element which satisfies a predicate. A more typesafe version of the already existing List.prototype.find.',
              signatureML: '(a -> Int -> [a] -> Bool) -> [a] -> Maybe a',
              signatureTS:
                '<T>(f: (x: T, index: number, arr: T[]) => boolean, list: T[]): Maybe<T>',
              examples: [
                {
                  input: 'List.find(x => x > 5, [1,3,7,9])',
                  output: 'Just(7)'
                },
                {
                  input: 'List.find(x => x > 5)([1,3,7,9])',
                  output: 'Just(7)'
                },
                {
                  input: 'List.find(x => x > 10, [1,3,7,9])',
                  output: 'Nothing'
                }
              ]
            },
            {
              name: 'findIndex',
              description:
                'Returns the index of the first element which satisfies a predicate. A more typesafe version of the already existing List.prototype.findIndex.',
              signatureML: '(a -> Int -> [a] -> Bool) -> [a] -> Maybe Int',
              signatureTS:
                '<T>(f: (x: T, index: number, arr: T[]) => boolean, list: T[]): Maybe<number>',
              examples: [
                {
                  input: 'List.findIndex(x => x > 5, [1,3,7,9])',
                  output: 'Just(2)'
                },
                {
                  input: 'List.findIndex(x => x > 5)([1,3,7,9])',
                  output: 'Just(2)'
                },
                {
                  input: 'List.findIndex(x => x > 10, [1,3,7,9])',
                  output: 'Nothing'
                }
              ]
            },
            {
              name: 'uncons',
              description: `Returns a tuple of an array's head and tail.`,
              signatureML: '[a] -> Maybe (a, [a]) ',
              signatureTS: '<T>(list: T[]): Maybe<Tuple<T, T[]>>',
              examples: [
                {
                  input: 'List.uncons([1, 2, 3])',
                  output: 'Just(Tuple(1, [2, 3]))'
                },
                { input: 'List.uncons([1])', output: 'Just(Tuple(1, []))' },
                { input: 'List.uncons([])', output: 'Nothing' }
              ]
            },
            {
              name: 'sum',
              description: 'Returns the sum of all numbers inside an array.',
              signatureML: '[Int] -> Int',
              signatureTS: '(list: number[]): number',
              examples: [
                { input: 'List.sum([])', output: '0' },
                { input: 'List.sum([1, 2, 3])', output: '6' }
              ]
            },
            {
              name: 'sort',
              description: 'Sorts an array with the given comparison function.',
              signatureML: '(a -> a -> Order) -> [a] -> [a]',
              signatureTS:
                '<T>(compare: (a: T, b: T) => Order, list: T[]): T[]',
              examples: [
                {
                  input:
                    "import { compare } from 'purify-ts/Function'\nList.sort(compare, [1,100,-1])",
                  output: '[-1, 1, 100]'
                },
                {
                  input:
                    "import { Order } from 'purify-ts/Function'\nList.sort((x, y) => /* your own fn */, [0,102,-223])",
                  output:
                    '// Result depends on the returned Order enum value (Order.LT, Order.EQ or Order.GT)'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'Function',
      description:
        "This module contains some basic function utilities. Something to note is that purify doesn't expose a compose or pipe function - that is because in JavaScript/TypeScript using those functions is not ergonomic and is prone to type errors related to generics.",
      example: {
        import:
          "import { Order, identity, always, ... } from 'purify-ts/Function'"
      },
      content: [
        {
          title: 'Exports',
          id: 'export',
          methods: [
            {
              name: 'identity',
              description:
                'The identity function, returns the value it was given.',
              examples: [],
              signatureML: 'a -> a',
              signatureTS: '<T>(x: T): T'
            },
            {
              name: 'always',
              description:
                'Returns a function that always returns the same value. Also known as `const` in other languages.',
              signatureML: 'a -> b -> a',
              signatureTS: '<T>(x: T): <U>(y: U) => T',
              examples: [
                {
                  input: '[1, 2, 3, 4].map(always(0))',
                  output: '[0, 0, 0, 0]'
                }
              ]
            },
            {
              name: 'curry',
              description:
                'Takes a function that receives multiple arguments and returns a "curried" version of that function that can take any number of those arguments and if they are less than needed a new function that takes the rest of them will be returned.',
              signatureTS:
                '<TArgs extends any[], TReturn>(fn: (...args: TArgs) => TReturn): CurriedFn<TArgs, TReturn>',
              examples: [
                {
                  input: `const sum3 = (
  x: number, y: number, z: number
) => x + y + z

const curriedSum3 = curry(sum3)`,
                  output: `curriedSum3(1)       // (y: number, z: number) => number
curriedSum3(1, 2)    // (z: number) => number
curriedSum3(1, 2, 3) // number
curriedSum3(1)(2)(3) // number
curriedSum3(1, 2)(3) // number
`
                }
              ]
            },
            {
              name: 'compose/flow/pipe',
              description:
                "There is no such function in purify! Unfortunately it's not possible to provide a type-safe version of compose and friends, so until TypeScript allows us to do that purify will not have them.",
              examples: []
            },
            {
              name: 'compare',
              description:
                'Compares two values using the default "<" and ">" operators.',
              signatureML: 'a -> b -> Order',
              signatureTS: '<T>(x: T, y: T): Order',
              examples: [
                { input: 'compare(1, 10)', output: 'Order.LT' },
                { input: "compare('a', 'a')", output: 'Order.EQ' },
                { input: 'compare(10, 1)', output: 'Order.GT' }
              ]
            },
            {
              name: 'orderToNumber',
              description:
                'Maps the Order enum to the values expected by the standard ECMAScript library when doing comparison (Array.prototype.sort, for example).',
              signatureML: 'Order -> Int',
              signatureTS: '(order: Order): number',
              examples: [
                { input: 'orderToNumber(Order.LT)', output: '-1' },
                { input: 'orderToNumber(Order.EQ)', output: '0' },
                { input: 'orderToNumber(Order.GT)', output: '1' }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'Codec',
      description:
        "This module allows you to create a boundary on the outermost layer of your application, usually where you process back-end data or communicate with a third-party API. A codec consists of two parts - an encoder and a decoder, hence the name. Using a decoder you can validate your expectations regarding the structure and type of data you're receiving. An encoder, on the other hand, lets you make sure you're sending your application data in the correct format and can also act as a mapper from your custom domain objects to plain JSON values. In case your infrastructure supports JSON schema you can also generate one from your codecs so that you don't have to deal with the error handling.",
      example: {
        import: `import { Codec, GetType, string, number ... } from 'purify-ts/Codec'`
      },
      content: [
        {
          title: 'Constructors',
          id: 'constructor',
          methods: [
            {
              name: 'interface',
              signatureTS:
                '<T extends Record<string, Codec<any>>>(properties: T): Codec<{[k in keyof T]: GetType<T[k]>}>',
              description: 'Creates a codec for any JSON object.',
              examples: [
                {
                  input: `Codec.interface({
    username: string,
    age: number,
    email: optional(string),
    followers: array(number)
})`,
                  output: `Codec<{
  username: string
  age: number
  email?: string
  followers: Array<number>
}>`
                }
              ]
            },
            {
              name: 'custom',
              signatureTS:
                '<T>(config: { decode: (value: unknown) => Either<string, T>, encode: (value: T) => any}): Codec<T>',
              description:
                'Creates a codec for any type, you can add your own deserialization/validation logic in the decode argument.',
              examples: [
                {
                  input: `//            ↓↓↓ It's important to specify the type argument
Codec.custom<string>({
    decode: input => (typeof input === 'string' ? Right(input) : Left('fail')),
    encode: input => input // strings have no serialization logic
})`,
                  output: 'Codec<string>'
                }
              ]
            }
          ]
        },
        {
          title: 'Type helpers',
          id: 'helper',
          methods: [
            {
              name: 'GetType',
              signatureTS:
                'GetType<T extends Codec<any>> = T extends Codec<infer U> ? U : never',
              description:
                'You can use this to get a free type from any codec.',
              examples: [
                {
                  input: `const User = Codec.interface({
  username: string,
  age: number
})

type User = GetType<typeof User>`,
                  output:
                    '// type User will equal {username: string; age: number}'
                }
              ]
            },
            {
              name: 'FromType',
              signatureTS: `FromType<T> = {[P in keyof Required<T>]: Pick<T, P> extends Required<Pick<T, P>> ? T[P] : T[P] | undefined}`,
              description:
                'Special type used when you want to do the opposite of `GetType` - define a Codec for an existing type. The problem is that due to technical limitations optional properties are hard to generate in TypeScript so Codec generates properties of type "T | undefined" instead, which is not compatible.',
              examples: [
                {
                  input: `type A = { a?: number }
const A: Codec<A> = Codec.interface({ a: optional(number) })`,
                  output:
                    "// Type 'Codec<{ a: number | undefined; }>' is not assignable to type 'Codec<A>'"
                },
                {
                  input: `type A = { a?: number }
const A: Codec<FromType<A>> = Codec.interface({ a: optional(number) })`,
                  output: 'Success!'
                }
              ]
            }
          ]
        },
        {
          title: 'Instance methods',
          id: 'instance',
          methods: [
            {
              name: 'decode',
              signatureTS: '(input: unknown) => Either<string, T>',
              description:
                "Takes a JSON value (i.e. a plain JS object) and runs the decode function the codec was constructed with. All of purify's built-in codecs return a descriptive error message in case the decode fails.",
              examples: []
            },
            {
              name: 'encode',
              signatureTS: '(input: T) => unknown',
              description:
                "Takes a runtime value and turns it into a JSON value using the encode function the codec was constructed with. Most of purify's built-in codecs have no custom encode method and they just return the same value, but you could add custom serialization logic for your custom codecs.",
              examples: []
            },
            {
              name: 'unsafeDecode',
              signatureTS: '(input: unknown) => T',
              description:
                'The same as the decode method, but throws an exception on failure. Please only use as an escape hatch.',
              examples: []
            },
            {
              name: 'schema',
              signatureTS: '() => JSONSchema6',
              description: '',
              examples: [
                {
                  input: `Codec.interface({
  username: string,
  age: number,
  email: optional(optional(oneOf([oneOf[string]]))),
  followers: array(number)
}).schema()`,
                  output: `{
  type: 'object',
  properties: {
    username: { type: 'string' },
    age: { type: 'number' },
    email: { type: 'string' }, // Schema is optimized
    followers: { type: 'array', items: [ { type: 'number' } ] }
  },
  required: [ 'username', 'age', 'followers' ]
}`
                }
              ]
            }
          ]
        },
        {
          title: 'Primitive codecs',
          id: 'primitive',
          methods: [
            {
              name: 'string',
              signatureTS: 'Codec<string>',
              description: `A codec for any string value. Most of the time you will use it to implement an interface codec (see the Codec.interface example above). Encoding a string acts like the identity function.`,
              examples: [
                {
                  input: `string.decode('purify-ts')`,
                  output: `Right('purify-ts')`
                },
                {
                  input: 'string.decode(3.14)',
                  output: `Left('Expected a string, but received a number with value 3.14')`
                }
              ]
            },
            {
              name: 'number',
              signatureTS: 'Codec<number>',
              description: `A codec for any number value. This includes anything that has a typeof number - NaN, Infinity etc. Encoding a number acts like the identity function.`,
              examples: [
                {
                  input: `number.decode(4.20)`,
                  output: `Right(4.20)`
                },
                {
                  input: `number.decode(null)`,
                  output: `Left('Expected a number, but received null')`
                }
              ]
            },
            {
              name: 'boolean',
              signatureTS: 'Codec<boolean>',
              description: `A codec for a boolean value.`,
              examples: [
                {
                  input: `boolean.decode(true)`,
                  output: `Right(true)`
                },
                {
                  input: `boolean.decode(0)`,
                  output: `Left('Expected a boolean, but received a number with value 0')`
                }
              ]
            },
            {
              name: 'nullType',
              signatureTS: 'Codec<null>',
              description: 'A codec for null only.',
              examples: [
                {
                  input: 'nullType.decode(null)',
                  output: 'Right(null)'
                }
              ]
            },
            {
              name: 'unknown',
              signatureTS: 'Codec<unknown>',
              description:
                'A codec that can never fail, but of course you get no type information. Encoding an unknown acts like the identity function.',
              examples: [
                {
                  input: 'unknown.decode(0)',
                  output: 'Right(0)'
                },
                {
                  input: 'unknown.decode({someObject: true})',
                  output: 'Right({someObject: true})'
                },
                {
                  input: 'unknown.decode(false)',
                  output: 'Right(false)'
                }
              ]
            },
            {
              name: 'date',
              signatureTS: 'Codec<Date>',
              description:
                'A codec for a parsable date string, on successful decoding it resolves to a Date object. The validity of the date string during decoding is decided by the browser implementation of Date.parse. Encode runs toISOString on the passed in date object.',
              examples: [
                {
                  input: "date.decode('2019-12-15T20:34:25.052Z')",
                  output: "Right(new Date('2019-12-15T20:34:25.052Z'))"
                },
                {
                  input: `date.encode(new Date(2019, 2, 13))`,
                  output: `'2019-03-12T22:00:00.000Z'`
                }
              ]
            }
          ]
        },
        {
          title: 'Complex codecs',
          id: 'complex',
          methods: [
            {
              name: 'oneOf',
              signatureTS:
                '<T extends Array<Codec<any>>>(codecs: T): Codec<GetType<T extends Array<infer U> ? U : never>>',
              description:
                "A codec combinator that receives a list of codecs and runs them one after another during decode and resolves to whichever returns Right or to Left if all fail. Keep in mind that encoding probably won't work correctly if you use a custom codec and it's not lawful (as in, decode(encode(X)) is not equal to X)",
              examples: [
                {
                  input: `const nullable = <T>(codec: Codec<T>): Codec<T | null> =>
  oneOf([codec, nullType])`,
                  output: 'Codec<T | null>'
                },
                {
                  input: `oneOf([string, nullType]).decode('Well, hi!')`,
                  output: `Right('Well, hi!')`
                },
                {
                  input: 'oneOf([string, nullType]).decode(null)',
                  output: 'Right(null)'
                }
              ]
            },
            {
              name: 'optional',
              signatureTS: '<T>(codec: Codec<T>): Codec<T | undefined>',
              description:
                'A codec for a value T or undefined. Mostly used for optional properties inside an object, hence the name.',
              examples: [
                {
                  input: 'optional(number).decode(undefined)',
                  output: 'Right(undefined)'
                },
                {
                  input: 'Codec.interface({ a: optional(number) }).decode({})',
                  output: 'Right({})'
                }
              ]
            },
            {
              name: 'nullable',
              signatureTS: '<T>(codec: Codec<T>): Codec<T | null>',
              description:
                'A codec for a value T or null. Keep in mind if you use `nullable` inside `Codec.interface` the property will still be required.',
              examples: [
                {
                  input: 'nullable(number).decode(null)',
                  output: 'Right(null)'
                }
              ]
            },
            {
              name: 'array',
              signatureTS: '<T>(codec: Codec<T>): Codec<Array<T>>',
              description: 'A codec for an array.',
              examples: [
                {
                  input: 'array(number).decode([3.14, 2, 3])',
                  output: 'Right([3.14, 2, 3])'
                },
                {
                  input: `array(oneOf([string, number])).decode(['x', 0, 'y', 1])`,
                  output: `Right(['x', 0, 'y', 1])`
                }
              ]
            },
            {
              name: 'record',
              signatureTS:
                '<K extends keyof any, V>(keyCodec: Codec<K>, valueCodec: Codec<V>): Codec<Record<K, V>>',
              description:
                'A codec for an object without specific properties, its restrictions are equivalent to the Record<K, V> type so you can only check for number and string keys.',
              examples: [
                {
                  input: 'record(string, boolean).decode({valid: true})',
                  output:
                    'Right({valid: true}) // but the type is Either<string, Record<string, boolean>>'
                },
                {
                  input:
                    "record(number, string).decode({0: 'user1', 1: 'user2'})",
                  output: `Right({0: \'user1\', 1: \'user2\'})`
                },
                {
                  input: "record(number, string).decode({valid: 'no'})",
                  output:
                    'Left(\'Problem with key type of property "valid": Expected a number, but received a string with value "valid"\')'
                }
              ]
            },
            {
              name: 'tuple',
              description:
                'The same as the array decoder, but accepts a fixed amount of array elements and you can specify each element type, much like the tuple type.',
              signatureTS:
                '<TS extends [Codec<any>, ...Codec<any>[]]>(codecs: TS): Codec<{[i in keyof TS]: TS[i] extends Codec<infer U> ? U : never}>',
              examples: [
                {
                  input: 'tuple([number]).decode([0, 1])',
                  output: `Left('Expected an array of length 1, but received an array with length of 2')`
                },
                {
                  input: "tuple([number]).decode([''])",
                  output: `Left('Problem with value at index 0: Expected a number, but received a string with value ""')`
                }
              ]
            },
            {
              name: 'map',
              description: 'A codec for the built-in Map type.',
              signatureTS:
                '<K, V>(keyCodec: Codec<K>, valueCodec: Codec<V>): Codec<Map<K, V>>',
              examples: [
                {
                  input: `map(string, number).decode([['a', 0], ['b', 1]])`,
                  output: 'Right(Map(2) {"a" => 0, "b" => 1})'
                },
                {
                  input:
                    'map(string, number).encode(new Map(Object.entries({a: 0, b: 1}))',
                  output: `[['a', 0], ['b', 1]]`
                }
              ]
            },
            {
              name: 'exactly',
              signatureTS:
                '<T extends (string | number | boolean)[]>(...expectedValues: T): Codec<T[number]>',
              description:
                "A codec that only succeeds decoding when the value is exactly what you've constructed the codec with.",
              examples: [
                {
                  input: `exactly('').decode('non-empty string')`,
                  output: `Left('Expected "", but received a string with value "non-empty string"')`
                },
                {
                  input: `exactly('None', 'Read', 'Write')`,
                  output: `Codec<"None" | "Read" | "Write">`
                }
              ]
            },
            {
              name: 'enumeration',
              signatureTS:
                '<T extends Record<string, string | number>>(e: T): Codec<T[keyof T]>',
              description: 'A codec for a TypeScript enum.',
              examples: [
                {
                  input: `enum Mode { Read, Write, ReadWrite }
                  
enumeration(Mode).decode(0)`,
                  output: `Right(Mode.Read)`
                }
              ]
            },
            {
              name: 'lazy',
              signatureTS: '<T>(getCodec: () => Codec<T>): Codec<T>',
              description:
                'A special codec used when dealing with recursive data structures, it allows a codec to be recursively defined by itself.',
              examples: [
                {
                  input: `interface Comment {
  content: string,
  responses: Comment[]
}

const Comment: Codec<Comment> = Codec.interface({
  content: string,
  responses: lazy(() => array(Comment))
})`,
                  output: 'Codec<Comment>'
                }
              ]
            },
            {
              name: 'intersect',
              signatureTS: '<T, U>(t: Codec<T>, u: Codec<U>): Codec<T & U>',
              description:
                'Creates an intersection between two codecs. If the provided codecs are not for an object, the second decode result will be returned.',
              examples: [
                {
                  input: `intersect(
  Codec.interface({a: number}),
  Codec.interface({b: string})
).decode({a: 5, b: ''})`,
                  output: `Right({a: 5, b: ''})`
                }
              ]
            }
          ]
        },
        {
          title: 'Purify-specific codecs',
          id: 'purify',
          methods: [
            {
              name: 'maybe',
              signatureTS: '<T>(codec: Codec<T>): Codec<Maybe<T>>',
              description: `A codec for purify's Maybe type. Encode runs Maybe#toJSON, which effectively returns the value inside if it's a Just or undefined if it's Nothing.`,
              examples: [
                {
                  input: 'maybe(number).decode(undefined)',
                  output:
                    'Right(Nothing) // Also works with missing properties inside an object'
                },
                {
                  input: 'maybe(number).decode(null)',
                  output: 'Right(Nothing)'
                },
                {
                  input: 'maybe(number).decode(123)',
                  output: 'Right(Just(123))'
                },
                {
                  input: 'maybe(number).encode(Just(0))',
                  output: '0'
                }
              ]
            },
            {
              name: 'nonEmptyList',
              signatureTS: '<T>(codec: Codec<T>): Codec<NonEmptyList<T>>',
              description: `A codec for purify's NEL type.`,
              examples: [
                {
                  input: 'nonEmptyList(number).decode([])',
                  output: `Left('Expected an array with one or more elements, but received an empty array')`
                },
                {
                  input: 'nonEmptyList(number).decode([0])',
                  output: 'Right(NonEmptyList([0]))'
                }
              ]
            }
          ]
        },
        {
          title: 'Utils',
          id: 'util',
          methods: [
            {
              name: 'parseError',
              signatureTS: '(error: string): DecodeError',
              description:
                'Turns a string error message produced by a built-in purify codec into a meta object.',
              examples: [
                {
                  input: `parseError(\`
  Problem with key type of property "a":
  Expected a number, but received a string with value "a"
\`)`,
                  output: `{
  type: 'property',
  property: 'a',
  error: {
    type: 'failure',
    expectedType: 'number',
    receivedType: 'string',
    receivedValue: 'a'
  }
}`
                }
              ]
            },

            {
              name: 'DecodeError',
              signatureTS: `DecodeError =
               { type: 'property'; property: string; error: DecodeError }
              | { type: 'index'; index: number; error: DecodeError }
              | { type: 'oneOf'; errors: DecodeError[] }
              | {
                  type: 'failure'
                  expectedType?: ExpectedType
                  receivedType: ReceivedType
                  receivedValue?: unknown
                }
              | { type: 'custom'; message: string }`,
              description: 'An ADT representing all possible decode errors',
              examples: []
            }
          ]
        }
      ]
    }
  ]
}

export default data
