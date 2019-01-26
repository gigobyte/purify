import * as React from 'react'
type Content = string | JSX.Element

export interface MethodExample {
  input: Content
  output: Content
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
  description: Content
  signatureML?: string
  signatureTS?: string
  examples: MethodExample[]
}

export interface DataType {
  name: string
  implements: string[]
  guides: DataTypeGuide[]
  description: Content
  examples: DataTypeExample[]
  constructors: Method[]
  staticMethods: Method[]
  instanceMethods: Method[]
  helperMethods?: Method[]
}

export interface Util {
  name: string
  description: Content
  example: {
    import: string
    before?: string[]
    after?: string[]
  }
  methods: Method[]
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
        'Monoid',
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
      ],
      description: `The Maybe type is one of the most popular data types available. It is fundamental to learning about functional error handling and representing missing values. A Maybe value can be either Just a value or Nothing. The Just data constructor is used for wrapping present values while the Nothing constructor is used when a value is absent. Both constructors produce objects that share the same API which makes it easy to manipulate optional values without null checking or exception handling.`,
      examples: [
        {
          title: 'How to import',
          content: [`import { Maybe, Just, Nothing } from 'purify-ts/Maybe'`],
        },
        {
          title: 'Without Maybe',
          content: [
            'let port: number',
            'let config: Config | null = getConfig()',
            '',
            `// Hard to chain additional transformations`,
            `// Doesn't protect against falsy values like empty string or 0`,
            '',
            'const port = config && config.port',
            '    ? parseInt(config.port)',
            '    : 8080',
          ],
        },
        {
          title: 'With Maybe',
          content: [
            'const port = getConfig()',
            '    .chain(x => x.port)',
            '    .map(parseInt)',
            '    .orDefault(8080)',
          ],
        },
      ],
      guides: [
        {
          title: 'Which method am I supposed to use now? (API guide)',
          link: '/guides/maybe-api-guide',
        },
      ],
      constructors: [
        {
          name: 'Just',
          description:
            'Constructs a Just. Respents an optional value that exists.',
          signatureML: 'a -> Maybe a',
          signatureTS: '<T>(value: T): Maybe<T>',
          examples: [
            { input: 'Just(10)', output: 'Just(10) // Maybe<number>' },
          ],
        },
        {
          name: 'Nothing',
          description: `Nothing doesn't have a constructor, instead you can use it directly as a value. Represents a missing value, you can think of it as a smart 'null'.`,
          examples: [{ input: 'Nothing', output: 'Nothing // Maybe<never>' }],
        },
      ],
      staticMethods: [
        {
          name: 'of',
          signatureML: 'a -> Maybe a',
          signatureTS: '<T>(value: T): Maybe<T>',
          description: 'Takes a value and wraps it in a `Just`.',
          examples: [{ input: 'Maybe.of(10)', output: 'Just(10)' }],
        },
        {
          name: 'empty',
          signatureML: '() -> Maybe a',
          signatureTS: '(): Maybe<never>',
          description: 'Returns `Nothing`.',
          examples: [{ input: 'Maybe.empty()', output: 'Nothing' }],
        },
        {
          name: 'zero',
          signatureML: '() -> Maybe a',
          signatureTS: '(): Maybe<never>',
          description: 'Returns `Nothing`.',
          examples: [{ input: 'Maybe.zero()', output: 'Nothing' }],
        },
        {
          name: 'fromNullable',
          signatureTS: '<T>(value?: T): Maybe<T>',
          description:
            'Takes a value and returns `Nothing` if the value is null or undefined, otherwise a `Just` is returned.',
          examples: [
            { input: 'Maybe.fromNullable(null)', output: 'Nothing' },
            { input: 'Maybe.fromNullable(10)', output: 'Just(10)' },
          ],
        },
        {
          name: 'fromFalsy',
          signatureTS: '<T>(value?: T): Maybe<T>',
          description:
            'Takes a value and returns Nothing if the value is falsy, otherwise a Just is returned.',
          examples: [
            { input: `Maybe.fromFalsy('')`, output: 'Nothing' },
            { input: 'Maybe.fromFalsy(0)', output: 'Nothing' },
          ],
        },
        {
          name: 'fromPredicate',
          signatureML: '(a -> Bool) -> a -> Maybe a',
          signatureTS: '<T>(pred: (value: T) => boolean, value: T): Maybe<T>',
          description:
            'Takes a predicate and a value, passes the value to the predicate and returns a Just if it returns true, otherwise a Nothing is returned',
          examples: [
            { input: 'Maybe.fromPredicate(x => x > 0, 5)', output: 'Just(5)' },
            { input: 'Maybe.fromPredicate(x => x > 0, -1)', output: 'Nothing' },
          ],
        },
        {
          name: 'catMaybes',
          signatureML: '[Maybe a] -> [a]',
          signatureTS: '<T>(list: Maybe<T>[]): T[]',
          description: 'Returns only the `Just` values in a list.',
          examples: [
            {
              input: 'Maybe.catMaybes([Just(5), Nothing, Just(10)])',
              output: '[5, 10]',
            },
          ],
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
              output: '[1, 3]',
            },
          ],
        },
        {
          name: 'encase',
          signatureTS: '<T>(throwsF: () => T): Maybe<T>',
          description:
            'Calls a function that may throw and wraps the result in a `Just` if successful or `Nothing` if an error is caught.',
          examples: [
            {
              input: `Maybe.encase(() => { throw new Error('Always fails') })`,
              output: 'Nothing',
            },
            { input: `Maybe.encase(() => 10)`, output: 'Just(10)' },
          ],
        },
      ],
      instanceMethods: [
        {
          name: 'isJust',
          signatureML: 'Maybe a ~> Bool',
          signatureTS: '(): boolean',
          description:
            'Returns true if `this` is `Just`, otherwise it returns false.',
          examples: [
            { input: 'Just(5).isJust()', output: 'true' },
            { input: 'Nothing.isJust()', output: 'false' },
          ],
        },
        {
          name: 'isNothing',
          signatureML: 'Maybe a ~> Bool',
          signatureTS: '(): this is Maybe<never>',
          description:
            'Returns true if `this` is `Nothing`, otherwise it returns false.',
          examples: [
            { input: 'Just(5).isNothing()', output: 'false' },
            { input: 'Nothing.isNothing()', output: 'true' },
          ],
        },
        {
          name: 'caseOf',
          signatureTS:
            '<U>(patterns: {Just: (value: T) => U, Nothing: () => U} | {_: () => U}): U',
          description:
            'Structural pattern matching for `Maybe` in the form of a function.',
          examples: [
            {
              input: 'Just(5).caseOf({ Just: x => x + 1, Nothing: () => 0 })',
              output: '6',
            },
            {
              input: 'Nothing.caseOf({ Just: x => x + 1, Nothing: () => 0 })',
              output: '0',
            },
            {
              input: `Nothing.caseOf({ _: () => 'anything'}) // wildcard`,
              output: `'anything'`,
            },
          ],
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
            { input: 'Just(5).equals(Nothing)', output: 'false' },
          ],
        },
        {
          name: 'map',
          signatureML: 'Maybe a ~> (a -> b) -> Maybe b',
          signatureTS: '<U>(f: (value: T) => U): Maybe<U>',
          description:
            'Transforms the value inside `this` with a given function. Returns `Nothing` if `this` is `Nothing`.',
          examples: [
            { input: 'Just(5).map(x => x + 1)', output: 'Just(6)' },
            { input: 'Nothing.map(x => x + 1)', output: 'Nothing' },
          ],
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
            { input: 'Nothing.ap(Nothing)', output: 'Nothing' },
          ],
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
            { input: 'Nothing.alt(Nothing)', output: 'Nothing' },
          ],
        },
        {
          name: 'chain',
          signatureML: 'Maybe a ~> (a -> Maybe b) -> Maybe b',
          signatureTS: '<U>(f: (value: T) => Maybe<U>): Maybe<U>',
          description:
            'Transforms `this` with a function that returns a `Maybe`. Useful for chaining many computations that may result in a missing value.',
          examples: [
            { input: 'Just(5).chain(x => Just(x + 1))', output: 'Just(6)' },
            { input: 'Nothing.chain(x => Just(x + 1))', output: 'Nothing' },
          ],
        },
        {
          name: 'chainNullable',
          signatureTS:
            '<U>(f: (value: T) => U | undefined | null | void): Maybe<U>',
          description:
            'Transforms `this` with a function that returns a nullable value. Equivalent to `m.chain(x => Maybe.fromNullable(f(x)))`',
          examples: [
            {
              input: 'Just({prop: null}).chainNullable(x => x.prop)',
              output: 'Nothing',
            },
            { input: 'Just(5).chainNullable(x => x + 1)', output: 'Just(6)' },
          ],
        },
        {
          name: 'join',
          signatureML: 'Maybe (Maybe a) ~> Maybe a',
          signatureTS: '<U>(this: Maybe<Maybe<U>>): Maybe<U>',
          description:
            'Flattens nested Maybes. `m.join()` is equivalent to `m.chain(x => x)`.',
          examples: [
            { input: 'Just(Just(5)).join()', output: 'Just(5)' },
            { input: 'Nothing.join()', output: 'Nothing' },
          ],
        },
        {
          name: 'reduce',
          signatureML: 'Maybe a ~> ((b, a) -> b, b) -> b',
          signatureTS:
            '<U>(reducer: (accumulator: U, value: T) => U, initialValue: U): U',
          description:
            'Takes a reducer and a initial value and returns the initial value if `this` is `Nothing` or the result of applying the function to the initial value and the value inside `this`.',
          examples: [
            { input: 'Just(5).reduce((acc, x) => x * acc, 2)', output: '10' },
            { input: 'Nothing.reduce((acc, x) => x * acc, 0)', output: '0' },
          ],
        },
        {
          name: 'extend',
          signatureML: 'Maybe a ~> (Maybe a -> b) -> Maybe b',
          signatureTS: '<U>(f: (value: Maybe<T>) => U): Maybe<U>',
          description:
            "Returns `this` if it's `Nothing`, otherwise it returns the result of applying the function argument to `this` and wrapping it in a `Just`.",
          examples: [
            { input: 'Just(5).extend(x => x.isJust())', output: 'Just(true)' },
            { input: 'Nothing.extend(x => x.isJust())', output: 'Nothing' },
          ],
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
              output: '// Error: Maybe got coerced to a null',
            },
          ],
        },
        {
          name: 'orDefault',
          signatureML: 'Maybe a ~ a -> a',
          signatureTS: '(defaultValue: T): T',
          description:
            'Returns the default value if `this` is `Nothing`, otherwise it return the value inside `this`.',
          examples: [
            { input: 'Just(5).orDefault(0)', output: '5' },
            { input: 'Nothing.orDefault(0)', output: '0' },
          ],
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
              output: '5 // expensiveComputation is never called',
            },
            { input: 'Nothing.orDefaultLazy(() => 0)', output: '0' },
          ],
        },
        {
          name: 'mapOrDefault',
          signatureML: 'Maybe a ~> (a -> b) -> b -> b',
          signatureTS: '<U>(f: (value: T) => U, defaultValue: U): U',
          description:
            'Maps over `this` and returns the resulting value or returns the default value if `this` is `Nothing`.',
          examples: [
            { input: 'Just(5).mapOrDefault(x => x + 1, 0)', output: '6' },
            { input: 'Nothing.mapOrDefault(x => x + 1, 0)', output: '0' },
          ],
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
              output: 'Nothing',
            },
          ],
        },
        {
          name: 'extract',
          signatureTS: '(): T | undefined',
          description:
            'Returns the value inside `this` or undefined if `this` is `Nothing`. Use `extractNullable` if you need a null returned instead.',
          examples: [
            { input: 'Just(5).extract()', output: '5' },
            { input: 'Nothing.extract()', output: 'undefined' },
          ],
        },
        {
          name: 'extractNullable',
          signatureTS: '(): T | null',
          description:
            'Returns the value inside `this` or null if `this` is `Nothing`. Use `extract` if you need an undefined returned instead.',
          examples: [
            { input: 'Just(5).extract()', output: '5' },
            { input: 'Nothing.extract()', output: 'undefined' },
          ],
        },
        {
          name: 'toList',
          signatureML: 'Maybe a ~> [a]',
          signatureTS: '(): T[]',
          description:
            'Returns empty list if the `Maybe` is `Nothing` or a list where the only element is the value of `Just`.',
          examples: [
            { input: 'Just(5).toList()', output: '[5]' },
            { input: 'Nothing.toList()', output: '[]' },
          ],
        },
        {
          name: 'toEither',
          signatureML: 'Maybe a ~> e -> Either e a',
          signatureTS: '<L>(left: L): Either<L, T>',
          description:
            'Constructs a `Right` from a `Just` or a `Left` with a provided left value if `this` is `Nothing`.',
          examples: [
            { input: `Just(5).toEither('Error')`, output: 'Right(5)' },
            { input: `Nothing.toEither('Error')`, output: `Left('Error')` },
          ],
        },
        {
          name: 'ifJust',
          signatureTS: '(effect: (value: T) => any): this',
          description:
            'Runs an effect if `this` is `Just`, returns `this` to make chaining other methods possible.',
          examples: [
            {
              input: `Just(5).ifJust(() => console.log('success'))`,
              output: `// success`,
            },
            {
              input: `Nothing.ifJust(() => console.log('success'))`,
              output: '',
            },
          ],
        },
        {
          name: 'ifNothing',
          signatureTS: '(effect: (value: T) => any): this',
          description:
            'Runs an effect if `this` is `Nothing`, returns `this` to make chaining other methods possible.',
          examples: [
            {
              input: `Just(5).ifNothing(() => console.log('failure'))`,
              output: '',
            },
            {
              input: `Nothing.ifNothing(() => console.log('failure'))`,
              output: '// failure',
            },
          ],
        },
      ],
    },
    {
      name: 'MaybeAsync',
      implements: ['Functor', 'Chain'],
      guides: [{ title: 'MaybeAsync for Haskellers', link: '/' }],
      description:
        'MaybeAsync is a wrapper around Promise<Maybe<T>> that allows you to process asynchronous missing values or, on a more technical level, allows you to seemlessly chain Promises that resolve to Maybe. The API of MaybeAsync is heavily influenced by monad transformers, but the implementation under the hood is nothing like that. Despite that little piece of trivia, no prior knowledge of monad transformers is required.',
      examples: [
        {
          title: 'How to import',
          content: [`import { MaybeAsync } from 'purify-ts/MaybeAsync'`],
        },
        {
          title: 'Example usage',
          content: [
            `declare function validateModel(model: Model): Maybe<Model>`,
            `declare function getUser(userId: number): Promise<Maybe<User>>`,
            `declare function insert(user: User): Promise<Document>`,
            '',
            'cosnt processRegistration = (model: Model): MaybeAsync<Document> =>',
            '    MaybeAsync(async ({ liftMaybe, fromPromise }) => {',
            '        const validatedModel: Model = await liftMaybe(validatedModel(model))',
            '        const user: User = await fromPromise(getUser(validatedModel.userId))',
            '',
            '        return await insert(user)',
            '    })',
            '',
            '// Now to unwrap',
            'const promise: Promise<Maybe<Document>> = processRegistration(model).run()',
          ],
        },
      ],
      constructors: [
        {
          name: 'MaybeAsync',
          description:
            'Constructs a MaybeAsync object from a function that takes an object full of helpers that let you lift things into the MaybeAsync context and returns a Promise',
          examples: [
            {
              input:
                'MaybeAsync(({ liftMaybe, fromPromise }) => Promise.resolve(5))',
              output: 'MaybeAsync<number>',
            },
          ],
          signatureML: '(MaybeAsyncHelpers -> IO a) -> MaybeAsync a',
          signatureTS: `<T>(runPromise: (helpers: MaybeAsyncHelpers) => PromiseLike<T>): MaybeAsync<T>`,
        },
      ],
      staticMethods: [],
      instanceMethods: [
        {
          name: 'run',
          signatureML: 'MaybeAsync a ~> IO (Maybe a)',
          signatureTS: 'run(): Promise<Maybe<T>>',
          description: (
            <div>
              It's important to remember how `run` will behave because in an
              async context there are other ways for a function to fail other
              than to return a Nothing, for example:
              <br />
              If any of the computations inside MaybeAsync resolved to Nothing,
              `run` will return a Promise resolved to Nothing.<br />
              If any of the promises were to be rejected then `run` will return
              a Promise resolved to Nothing.<br />
              If an exception is thrown then `run` will return a Promise
              resolved to Nothing.<br />
              If none of the above happen then a promise resolved to the
              returned value wrapped in a Just will be returned.
            </div>
          ),
          examples: [
            {
              input:
                'MaybeAsync(async ({ liftMaybe }) => { return await liftMaybe(Nothing) }).run()',
              output: 'Promise {<resolved>: Nothing}',
            },
            {
              input: 'MaybeAsync(() => Promise.reject()).run()',
              output: 'Promise {<resolved>: Nothing}',
            },
            {
              input: `MaybeAsync(() => { throw new Error('Something happened') }).run()`,
              output: 'Promise {<resolved>: Nothing}',
            },
            {
              input: 'MaybeAsync(() => Promise.resolve(5)).run()',
              output: 'Promise {<resolved>: Just(5)}',
            },
          ],
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
              output: 'Promise {<resolved>: Just(6)}',
            },
          ],
        },
        {
          name: 'chain',
          description:
            'Transforms `this` with a function that returns a `MaybeAsync`. Behaviour is the same as the regular Maybe#chain.',
          signatureML: 'MaybeAsync a ~> (a -> b) -> MaybeAsync b',
          signatureTS: '<U>(f: (value: T) => U): MaybeAsync<U>',
          examples: [
            {
              input: `MaybeAsync(() => Promise.resolve(5))
  .chain(x => MaybeAsync(() => Promise.resolve(x + 1)))
  .run()`,
              output: 'Promise {<resolved>: Just(6)}',
            },
          ],
        },
      ],
      helperMethods: [
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
              output: 'Promise {<resolved>: Just(5)}',
            },
          ],
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
              output: 'Promise {<resolved>: Just(5)}',
            },
          ],
        },
      ],
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
        'Bifunctor',
      ],
      description: `Either is a data type with two sides (constructors) - Left and Right. It is most commonly used for error handling as it is very similar to the Maybe type with the only difference being that you can store information about the missing value (an error message for example). By convention, "Right is right", meaning that success is stored on the Right and failure is stored on the Left. It is also important to note that Either is right-biased which means that \`map\`, \`chain\` and other similar methods will operate on the right side.`,
      examples: [
        {
          title: 'How to import',
          content: [`import { Either, Left, Right } from 'purify-ts/Either'`],
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
            `    throw new Error("Couldn't parse port from config")`,
            '}',
            '',
            'let port: number',
            '',
            'try {',
            '    port = parseInt(getPort())',
            '} catch (e) {',
            '    loggingService.log(e.message)',
            '    port = 8080',
            '}',
          ],
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
            '    .orDefault(8080)',
          ],
        },
      ],
      guides: [],
      constructors: [
        {
          name: 'Left',
          description:
            'Constructs a Left. Most commonly represents information about an operation that failed.',
          signatureML: 'a -> Either a b',
          signatureTS: '<L>(value: L): Either<L, never>',
          examples: [
            {
              input: `Left('Error')`,
              output: `Left('Error') // Either<string, never>`,
            },
          ],
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
              output: 'Right(10) // Either<never, number>',
            },
          ],
        },
      ],
      staticMethods: [
        {
          name: 'of',
          description: 'Takes a value and wraps it in a `Right`.',
          signatureML: 'b -> Either a b',
          signatureTS: '<R>(value: R): Either<never, R>',
          examples: [{ input: 'Either.of(5)', output: 'Right(5)' }],
        },
        {
          name: 'lefts',
          description:
            'Takes a list of eithers and returns a list of all `Left` values.',
          signatureML: '[Either a b] -> [a]',
          signatureTS: '<L, R>(list: Either<L,R>[]): L[]',
          examples: [
            {
              input: `Either.lefts([Left('Server error'), Left('Wrong password'), Right('foo@bar.com')])`,
              output: `['Server error', 'Wrong password']`,
            },
          ],
        },
        {
          name: 'rights',
          description:
            'Takes a list of eithers and returns a list of all `Right` values.',
          signatureML: '[Either a b] -> [b]',
          signatureTS: '<L, R>(list: Either<L, R>[]): R[]',
          examples: [
            {
              input: `Either.rights([Right(10), Left('Invalid input'), Right(5)])`,
              output: '[10, 5]',
            },
          ],
        },
        {
          name: 'encase',
          description:
            'Calls a function and returns a `Right` with the return value or an exception wrapped in a `Left` in case of failure.',
          signatureTS: '<L extends Error, R>(throwsF: () => R): Either<L, R>',
          examples: [
            {
              input: `Either.encase(() => { throw new Error('Always fails') })`,
              output: `Left(new Error('Always fails'))`,
            },
            { input: 'Either.encase(() => 10)', output: 'Right(10)' },
          ],
        },
      ],
      instanceMethods: [
        {
          name: 'isLeft',
          description:
            'Returns true if `this` is `Left`, otherwise it returns false.',
          signatureML: 'Either a b -> Bool',
          signatureTS: '(): boolean',
          examples: [
            { input: `Left('Error').isLeft()`, output: 'true' },
            { input: `Right(10).isLeft()`, output: 'false' },
          ],
        },
        {
          name: 'isRight',
          description:
            'Returns true if `this` is `Right`, otherwise it returns false.',
          signatureML: 'Either a b -> Bool',
          signatureTS: '(): boolean',
          examples: [
            { input: `Left('Error').isRight()`, output: 'false' },
            { input: `Right(10).isRight()`, output: 'true' },
          ],
        },
        {
          name: 'caseOf',
          description:
            'Structural pattern matching for `Either` in the form of a function.',
          signatureTS:
            '<T>(patterns: { Left: (l: L) => T, Right: (r: R) => T }): T',
          examples: [
            {
              input: `Left('Error').caseOf({ Left: x => x, Right: () => 'No error' })`,
              output: `'Error'`,
            },
            {
              input: `Right(6).caseOf({ Left: _ => 0, Right: x => x + 1 })`,
              output: '7',
            },
            {
              input: `Left('Error').caseOf({ _: () => 0 }) // wildcard`,
              output: '0',
            },
          ],
        },
        {
          name: 'bimap',
          description:
            'Given two functions, maps the value inside `this` using the first if `this` is `Left` or using the second one if `this` is `Right`. If both functions return the same type consider using `Either#either` instead.',
          signatureML: 'Either a b ~> (a -> c, b -> d) -> Either c d',
          signatureTS:
            '<L2, R2>(f: (value: L) => L2, g: (value: R) => R2): Either<L2, R2>',
          examples: [
            {
              input: `Left('Error').bimap(x => x + '!', x => x + 1)`,
              output: `Left('Error!')`,
            },
            {
              input: `Right(5).bimap(x => x + '!', x => x + 1)`,
              output: `Right(6)`,
            },
          ],
        },
        {
          name: 'map',
          description:
            'Maps the `Right` value of `this`, acts like an identity if `this` is `Left`.',
          signatureML: 'Either a b ~> (b -> c) -> Either a c',
          signatureTS: '<R2>(f: (value: R) => R2): Either<L, R2>',
          examples: [
            { input: `Left('Error').map(x => x + 1)`, output: `Left('Error')` },
            { input: `Right(5).map(x => x + 1)`, output: `Right(6)` },
          ],
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
              output: `Left('Error!')`,
            },
            { input: `Right(5).mapLeft(x => x + '!')`, output: `Right(5)` },
          ],
        },
        {
          name: 'ap',
          description:
            'Applies a `Right` function over a `Right` value. Returns `Left` if either `this` or the function are `Left`.',
          signatureML: 'Either a b ~> Either a (b -> c) -> Either a c',
          signatureTS:
            '<R2>(other: Either<L, (value: R) => R2>): Either<L, R2>',
          examples: [
            { input: 'Right(5).ap(Right(x => x + 1))', output: 'Right(6)' },
            { input: `Right(5).ap(Left('Error'))`, output: `Left('Error')` },
            {
              input: `Left('Error').ap(Right(x => x + 1))`,
              output: `Left('Error')`,
            },
            {
              input: `Left('Error').ap(Left('Function Error'))`,
              output: `Left('Function Error')`,
            },
          ],
        },
        {
          name: 'equals',
          description:
            'Compares `this` to another `Either`, returns false if the constructors or the values inside are different.',
          signatureML: 'Either a b ~> Either a b -> Bool',
          signatureTS: '(other: Either<L, R>): boolean',
          examples: [
            { input: `Left('Error').equals(Left('Error'))`, output: 'true' },
            { input: `Right(5).equals(Right(5))`, output: 'true' },
            { input: `Left(10).equals(Right(10))`, output: 'false' },
            { input: `Right(5).equals(Left('Error'))`, output: 'false' },
          ],
        },
        {
          name: 'chain',
          description:
            'Transforms `this` with a function that returns an `Either`. Useful for chaining many computations that may fail.',
          signatureML: 'Either a b ~> (b -> Either a c) -> Either a c',
          signatureTS: '<R2>(f: (value: R) => Either<L, R2>): Either<L, R2>',
          examples: [
            {
              input: `Left('Error').chain(x => Right(x + 1))`,
              output: `Left('Error')`,
            },
            { input: `Right(5).chain(x => Right(x + 1))`, output: `Right(6)` },
          ],
        },
        {
          name: 'join',
          description:
            'Flattens nested Eithers. `e.join()` is equivalent to `e.chain(x => x)`',
          signatureML: 'Either a (Either a b) ~> Either a b',
          signatureTS: '<R2>(this: Either<L, Either<L, R2>>): Either<L, R2>',
          examples: [
            { input: 'Right(Right(5)).join()', output: 'Right(5)' },
            {
              input: `Left(Left('Error')).join()`,
              output: `Left(Left('Error'))`,
            },
          ],
        },
        {
          name: 'alt',
          description:
            'Returns the first `Right` between `this` and another `Either` or the `Left` in the argument if both `this` and the argument are `Left`.',
          signatureML: 'Either a b ~> Either a b -> Either a b',
          signatureTS: 'other: Either<L, R>): Either<L, R>',
          examples: [
            {
              input: `Left('Error').alt(Left('Error!'))`,
              output: `Left('Error!')`,
            },
            { input: `Left('Error').alt(Right(5))`, output: `Right(5)` },
            { input: `Right(5).alt(Left('Error'))`, output: `Right(5)` },
            { input: `Right(5).alt(Right(6))`, output: `Right(5)` },
          ],
        },
        {
          name: 'reduce',
          description:
            'Takes a reducer and a initial value and returns the initial value if `this` is `Left` or the result of applying the function to the initial value and the value inside `this`.',
          signatureML: 'Either a b ~> ((c, b) -> c, c) -> c',
          signatureTS:
            '<T>(reducer: (accumulator: T, value: R) => T, initialValue: T): T',
          examples: [
            { input: 'Right(5).reduce((acc, x) => x * acc, 2)', output: '10' },
            {
              input: `Left('Error').reduce((acc, x) => x * acc, 0)`,
              output: '0',
            },
          ],
        },
        {
          name: 'extend',
          description:
            "Returns `this` if it's a `Left`, otherwise it returns the result of applying the function argument to `this` and wrapping it in a `Right`.",
          signatureML: 'Either a b ~> (Either a b -> c) -> Either a c',
          signatureTS: '<R2>(f: (value: Either<L, R>) => R2): Either<L, R2>',
          examples: [
            {
              input: `Left('Error').extend(x => x.isRight())`,
              output: `Left('Error')`,
            },
            {
              input: `Right(5).extend(x => x.isRight())`,
              output: `Right(true)`,
            },
          ],
        },
        {
          name: 'unsafeCoerce',
          description:
            'Returns the value inside `this` or throws an error if `this` is a `Left`.',
          signatureTS: '(): R',
          examples: [
            { input: 'Right(5).unsafeCoerce()', output: '5' },
            {
              input: `Left('Error').unsafeCoerce()`,
              output: '// Error: Either got coerced to a Left',
            },
          ],
        },
        {
          name: 'orDefault',
          description:
            "Returns the value inside `this` if it's `Right` or a default value if `this` is `Left`.",
          signatureML: 'Either a b ~> b -> b',
          signatureTS: '(defaultValue: R): R',
          examples: [
            { input: `Left('Error').orDefault(0)`, output: '0' },
            { input: `Right(5).orDefault(0)`, output: '5' },
          ],
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
              output: `'Error'`,
            },
            {
              input: `Right(5).leftOrDefault('No error')`,
              output: `'No error'`,
            },
          ],
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
              output: '5 // expensiveComputation is never called',
            },
          ],
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
              output: `'Error'`,
            },
            {
              input: `Right(5).leftOrDefault(() => 'No error')`,
              output: `'No error'`,
            },
          ],
        },
        {
          name: 'toMaybe',
          description:
            "Constructs a `Just` with the value of `this` if it's `Right` or a `Nothing` if `this` is `Left`.",
          signatureML: 'Either a b ~> Maybe b',
          signatureTS: '(): Maybe<R>',
          examples: [
            { input: `Left('Error').toMaybe()`, output: 'Nothing' },
            { input: `Right(5).toMaybe()`, output: 'Just(5)' },
          ],
        },
        {
          name: 'leftToMaybe',
          description:
            "Constructs a `Just` with the value of `this` if it's `Left` or a `Nothing` if `this` is `Right`.",
          signatureML: 'Either a b ~> Maybe a',
          signatureTS: '(): Maybe<L>',
          examples: [
            { input: `Left('Error').toMaybe()`, output: `Just('Error')` },
            { input: `Right(5).toMaybe()`, output: 'Nothing' },
          ],
        },
        {
          name: 'ifLeft',
          description:
            'Runs an effect if `this` is `Left`, returns `this` to make chaining other methods possible.',
          signatureTS: '(effect: (value: L) => any): this',
          examples: [
            {
              input: `Left('Error').ifLeft((err) => console.log(err))`,
              output: `// Error`,
            },
            {
              input: `Right(5).ifLeft(() => console.log('Unexpected error'))`,
              output: '',
            },
          ],
        },
        {
          name: 'ifRight',
          description:
            'Runs an effect if `this` is `Right`, returns `this` to make chaining other methods possible.',
          signatureTS: '(effect: (value: R) => any): this',
          examples: [
            {
              input: `Left('Error').ifRight((result) => console.log(result))`,
              output: ``,
            },
            {
              input: `Right(5).ifRight((result) => console.log(result))`,
              output: '// 5',
            },
          ],
        },
        {
          name: 'either',
          description:
            'Given two map functions, maps using the first if `this` is `Left` or using the second one if `this` is `Right`. If you want the functions to return different types depending on the either you may want to use `Either#bimap` instead.',
          signatureML: '(a -> c) -> (b -> c) -> Either a b -> c',
          signatureTS:
            '<T>(ifLeft: (value: L) => T, ifRight: (value: R) => T): T',
          examples: [
            { input: 'Right(5).either(_ => 0, x => x + 1)', output: '6' },
            {
              input: `Left('Error').either(x => x + '!', _ => '')`,
              output: `'Error!'`,
            },
          ],
        },
        {
          name: 'extract',
          description: 'Extracts the value out of `this`.',
          signatureTS: '(): L | R',
          examples: [
            { input: 'Right(5).extract()', output: '5' },
            { input: `Left('Error').extract()`, output: `'Error'` },
          ],
        },
      ],
    },
    {
      name: 'Tuple',
      implements: ['Setoid', 'Functor', 'Bifunctor', 'Apply'],
      description: `Tuple, also known as Pair, is a data type containing two values. You can think of it as an immutable array of only two elements, but unlike arrays (which are commonly homogeneous), the two values inside can be of different types.`,
      examples: [
        {
          title: 'How to import',
          content: [`import { Tuple } from 'purify-ts/Tuple'`],
        },
      ],
      guides: [],
      constructors: [
        {
          name: 'Tuple',
          description: 'Constructs a tuple.',
          signatureML: 'a -> b -> (a, b)',
          signatureTS: '<F, S>(fst: F, snd: S): Tuple<F, S>',
          examples: [
            {
              input: 'Tuple(1, true)',
              output: 'Tuple(1, true) // Tuple<number, boolean>',
            },
          ],
        },
      ],
      staticMethods: [
        {
          name: 'fromArray',
          description: 'Constructs a tuple from an array with two elements.',
          signatureTS: '<F, S>([fst, snd]: [F, S]): Tuple<F, S>',
          examples: [
            { input: 'Tuple.fromArray([5, 10])', output: 'Tuple(5, 10)' },
          ],
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
              output: `Tuple('s', 3)`,
            },
            {
              input: `Tuple.fanout(x => x[0], x => x.length)('sss')`,
              output: `Tuple('s', 3)`,
            },
          ],
        },
      ],
      instanceMethods: [
        {
          name: '[Symbol.iterator]',
          description:
            '`Tuple` implements the Iterator and ArrayLike interfaces, which means that you can destructure tuples like you would destructure arrays',
          examples: [
            {
              input: `const [ fst, snd ] = Tuple(1, 'str')`,
              output:
                '// Types are preserved - fst has type of number, snd has type of string',
            },
          ],
        },
        {
          name: 'fst',
          description: 'Returns the first value of `this`.',
          signatureML: '(a, b) ~> a',
          signatureTS: '(): F',
          examples: [{ input: 'Tuple(5, 10).fst()', output: '5' }],
        },
        {
          name: 'snd',
          description: 'Returns the second value of `this`.',
          signatureML: '(a, b) ~> b',
          signatureTS: '(): S',
          examples: [{ input: 'Tuple(5, 10).snd()', output: '10' }],
        },
        {
          name: 'equals',
          description: 'Compares the values inside `this` and another tuple.',
          signatureML: '(a, b) ~> (a, b) -> Bool',
          signatureTS: 'other: Tuple<F, S>): boolean',
          examples: [
            { input: 'Tuple(5, 10).equals(Tuple(5, 10))', output: 'true' },
            { input: `Tuple(5, 'foo').equals(5, 'bar')`, output: 'false' },
          ],
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
              output: `Tuple(2, 'apples')`,
            },
          ],
        },
        {
          name: 'map',
          description: 'Applies a function to the second value of `this`.',
          signatureML: '(a, b) ~> (b -> c) -> (a, c)',
          signatureTS: '<S2>(f: (snd: S) => S2): Tuple<F, S2>',
          examples: [
            {
              input: `Tuple('configured', false).map(x => !x)`,
              output: `Tuple('configured', true)`,
            },
          ],
        },
        {
          name: 'mapFirst',
          description: 'Applies a function to the first value of `this`.',
          signatureML: '(a, b) ~> (a -> c) -> (c, b)',
          signatureTS: '<F2>(f: (fst: F) => F2): Tuple<F2, S>',
          examples: [
            {
              input: `Tuple(2, 'items').mapFirst(x => x + 1)`,
              output: `Tuple(3, 'items')`,
            },
          ],
        },
        {
          name: 'ap',
          description:
            'Applies the second value of a tuple to the second value of `this`.',
          signatureML: '(a, b) ~> (c, (b -> d)) -> (a, d)',
          signatureTS: '<T, S2>(f: Tuple<T, (value: S) => S2>): Tuple<F, S2>',
          examples: [
            {
              input: `Tuple(5, 10).ap(Tuple('increment', x => x + 1))`,
              output: `Tuple(5, 11)`,
            },
          ],
        },
        {
          name: 'reduce',
          description:
            'A somewhat arbitraty implementation of Foldable for Tuple, the reducer will be passed the initial value and the second value insinde `this` as arguments',
          signatureML: '(a, b) ~> (b -> a -> b) -> b -> b',
          signatureTS:
            '<T>(reducer: (accumulator: T, value: S) => T, initialValue: T): T',
          examples: [
            {
              input: `Tuple(5, 10).reduce((acc, x) => acc + x, 10)`,
              output: '20',
            },
          ],
        },
        {
          name: 'swap',
          description: 'Swaps the values inside `this`.',
          signatureML: '(a, b) ~> (b, a)',
          signatureTS: '(): Tuple<S, F>',
          examples: [{ input: 'Tuple(0, 1).swap()', output: 'Tuple(1, 0)' }],
        },
        {
          name: 'toArray',
          description:
            'Returns an array with 2 elements - the values inside `this`.',
          signatureTS: '(): [F, S]',
          examples: [
            {
              input: `Tuple('username', true).toArray()`,
              output: `['username', true]`,
            },
          ],
        },
      ],
    },
    {
      name: 'NonEmptyList',
      implements: [],
      description: `A type which represents a list that is not empty. NonEmptyList has no runtime, during execution it's a regular array. This gives not only performance benefits, but it also allows you to use Array and NonEmptyList interchangeably - you can pass a NonEmptyList to any function that expects an Array (this includes access to all Array.prototype methods like map and filter for free).`,
      examples: [
        {
          title: 'How to import',
          content: [`import { NonEmptyList } from 'purify-ts/NonEmptyList'`],
        },
      ],
      guides: [],
      constructors: [
        {
          name: 'NonEmptyList',
          signatureTS:
            '<T extends NonEmptyListCompliant<T[number]>>(list: T): NonEmptyList<T[number]>',
          description:
            'Typecasts an array with at least one element into a `NonEmptyList`. Works only if the compiler can confirm that the array has one or more elements.',
          examples: [
            { input: 'NonEmptyList([1])', output: '// NonEmptyList<number>' },
            { input: 'NonEmptyList([])', output: '// Compiler error' },
          ],
        },
      ],
      staticMethods: [
        {
          name: 'fromArray',
          description:
            'Return a `Just NonEmptyList` if the parameter has one or more elements, otherwise it returns `Nothing`.',
          signatureML: '[a] -> Maybe (NonEmptyList a)',
          signatureTS: '<T>(source: T[]): Maybe<NonEmptyList<T>>',
          examples: [
            {
              input: 'NonEmptyList.fromArray([1])',
              output: 'Just(NonEmptyList([1]))',
            },
            { input: 'NonEmptyList.fromArray([])', output: 'Nothing' },
          ],
        },
        {
          name: 'fromTuple',
          description: 'Converts a `Tuple` to a `NonEmptyList`.',
          signatureTS: '<T, U>(source: Tuple<T, U>): NonEmptyList<T | U>',
          examples: [
            {
              input: 'NonEmptyList.fromTuple(Tuple(1, 2))',
              output: 'NonEmptyList([1, 2])',
            },
          ],
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
                '// Error: NonEmptyList#unsafeCoerce passed an empty array',
            },
            {
              input: 'NonEmptyList.unsafeCoerce([1])',
              output: '// NonEmptyList<number>',
            },
          ],
        },
        {
          name: 'isNonEmpty',
          signatureML: '[a] -> Bool',
          signatureTS: '<T>(list: T[]): list is NonEmptyList<T>',
          description:
            'Returns true and narrows the type if the passed array has one or more elements.',
          examples: [{ input: 'NonEmptyList.isNonEmpty([1])', output: 'true' }],
        },
        {
          name: 'head',
          signatureML: 'NonEmptyList a -> a',
          signatureTS: '<T>(list: NonEmptyList<T>): T',
          description: `The same function as \`List#head\`, but it doesn't return a Maybe as a NonEmptyList will always have a head.`,
          examples: [],
        },
        {
          name: 'last',
          signatureML: 'NonEmptyList a -> a',
          signatureTS: '<T>(list: NonEmptyList<T>): T',
          description: `The same function as \`List#last\`, but it doesn't return a Maybe as a NonEmptyList will always have a last element.`,
          examples: [],
        },
      ],
      instanceMethods: [],
      helperMethods: [],
    },
  ],
  utils: [
    {
      name: 'List',
      description:
        'This module contains type-safe functions for working with arrays.',
      example: {
        import: `import { head, last, tail, init, uncons } from 'purify-ts/List'`,
      },
      methods: [
        {
          name: 'at',
          description: 'Returns the element at a given index of a list',
          signatureML: 'Integer -> [a] -> Maybe a',
          signatureTS: '<T>(index: number, list: T[]): Maybe<T>',
          examples: [
            { input: 'at(0, [1, 2])', output: 'Just(1)' },
            { input: 'at(2, [1, 2])', output: 'Nothing' },
          ],
        },
        {
          name: 'head',
          description: `Returns Just the first element of an array or Nothing if there is none. If you don't want to work with a Maybe but still keep type safety, check out \`NonEmptyList\``,
          signatureML: '[a] -> Maybe a',
          signatureTS: '<T>(list: T[]): Maybe<T>',
          examples: [
            { input: 'head([1])', output: 'Just(1)' },
            { input: 'head([])', output: 'Nothing' },
          ],
        },
        {
          name: 'last',
          description:
            'Returns Just the last element of an array or Nothing if there is none.',
          signatureML: '[a] -> Maybe a',
          signatureTS: '<T>(list: T[]): Maybe<T>',
          examples: [
            { input: 'last([1, 2, 3])', output: 'Just(3)' },
            { input: 'last([])', output: 'Nothing' },
          ],
        },
        {
          name: 'tail',
          description: 'Returns all elements of an array except the first.',
          signatureML: '[a] -> Maybe [a]',
          signatureTS: '<T>(list: T[]): Maybe<T[]>',
          examples: [
            { input: 'tail([1, 2, 3])', output: 'Just([2, 3])' },
            { input: 'tail([1])', output: 'Just([])' },
            { input: 'tail([])', output: 'Nothing' },
          ],
        },
        {
          name: 'init',
          description: 'Returns all elements of an array except the last.',
          signatureML: '[a] -> Maybe [a]',
          signatureTS: ' <T>(list: T[]): Maybe<T[]>',
          examples: [
            { input: 'init([1, 2, 3])', output: 'Just([1, 2])' },
            { input: 'init([1])', output: 'Just([])' },
            { input: 'init([])', output: 'Nothing' },
          ],
        },
        {
          name: 'uncons',
          description: `Returns a tuple of an array's head and tail.`,
          signatureML: '[a] -> Maybe (a, [a]) ',
          signatureTS: '<T>(list: T[]): Maybe<Tuple<T, T[]>>',
          examples: [
            { input: 'uncons([1, 2, 3])', output: 'Just(Tuple(1, [2, 3]))' },
            { input: 'uncons([1])', output: 'Just(Tuple(1, []))' },
            { input: 'uncons([])', output: 'Nothing' },
          ],
        },
      ],
    },
  ],
}

export default data
