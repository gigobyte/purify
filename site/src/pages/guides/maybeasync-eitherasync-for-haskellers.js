import React from 'react'
import Layout from '../../components/Layout'
import { HL } from '../../components/HL'
import SyntaxHighlighter from 'react-syntax-highlighter'
import highlightStyle from 'react-syntax-highlighter/dist/esm/styles/hljs/googlecode'
import { Note } from './maybe-api-guide'

const MaybeApiGuide = (props) => (
  <Layout location={props.location}>
    <h1>MaybeAsync and EitherAsync for Haskellers</h1>
    <Note>
      Keep in mind a lot of stuff have changed since this was written (back in
      January 2019), Either and MaybeAsync evolved to be more distant than the
      monad transformer design in late 2020
      <br /> and instead adopted the PromiseLike interface to make it easier to
      work with and reduce the large amount of boilerplate the original
      implementation required.
    </Note>
    <br />
    As mentioned in the description of those data types, MaybeAsync and
    EitherAsync are funky Promise-specialized monad transformers for Maybe and
    Either.
    <br />
    Some things may feel out of place and that is completely intentional,
    porting monad transformers over to TypeScript was just not practical,
    especially the higher-kinded types and typeclasses part.
    <br />A lot of thought went into designing the APIs and I believe that the
    result is satisfactory. In fact, even though the implementation is
    completely different, code written in mtl style looks pretty similar! Here,
    take a look:
    <SyntaxHighlighter language="haskell" style={highlightStyle}>
      {`tryToInsertUser user = runExceptT $ do
  validatedUser <- liftEither $ validateUser user
  userExists <- lift $ doesUserAlreadyExist validatedUser

  when userExists (throwE UserAlreadyExists)

  maybeToExceptT ServerError $ do
    updatedUser <- MaybeT $ hashPasswordInUser user
    lift $ insertUser updatedUser`}
    </SyntaxHighlighter>
    Keep in mind this code is not representative of the perfect or cleanest
    implementation for such a feature, I tried to shove as much functions, that
    are also possible in Maybe-EitherAsync, as I could.
    <br />
    Here's the same logic implemented with purify in TypeScript:
    <SyntaxHighlighter language="typescript" style={highlightStyle}>
      {`const tryToInsertUser = user =>
  EitherAsync(async ({ liftEither, throwE, fromPromise }) => {
    const validatedUser = await liftEither(validateUser(user))
    const userExists = await doesUserAlreadyExist(validatedUser)

    if (userExists) throwE('UserAlreadyExists')

    return fromPromise(MaybeAsync(async ({ fromPromise }) => {
        const updatedUser = await fromPromise(hashPasswordInUser(user))
        return insertUser(updatedUser)
    }).toEitherAsync('ServerError').run())
  })`}
    </SyntaxHighlighter>
    One important thing to understand about Maybe and EitherAsync is that the
    docs and the API create the illusion that code is running in some custom
    magical context that lets you safely unwrap values.
    <br />
    Is it referred to as "MaybeAsync context" or "EitherAsync context", but in
    fact there's no magic and the only real context is the async/await block.
    <br />
    That allows us to simulate do-notation using await and what those "lifting"
    function actually do is return Promises that get rejected when a value is
    missing. <br />
    The `run` function will later on catch all those rejections and return a
    proper Maybe/Either value.
    <h3>Glossary of functions</h3>
    <ul>
      <li>{'MaybeAsync<a>'} = MaybeT IO a</li>
      <li>{'EitherAsync<e, a>'} = ExceptT e IO a</li>
      <li>
        liftEither/Maybe = liftEither/Maybe (<HL>MaybeT/ExceptT . return</HL> in
        Haskell, but nothing like that in purify, they function the same though)
      </li>
      <li>
        fromPromise = the MaybeT/ExceptT constructor (you only need to wrap the
        IO action with the newtype in Haskell, in purify it's not as simple)
      </li>
      <li>throwE = throwE</li>
      <li>
        MaybeAsync#toEitherAsync = maybeToExceptT (from the{' '}
        <a href="http://hackage.haskell.org/package/transformers-0.5.5.0/docs/Control-Monad-Trans-Maybe.html#v:maybeToExceptT">
          transformers package
        </a>
        )
      </li>
      <li>EitherAsync#toMaybeAsync = exceptToMaybeT</li>
    </ul>
  </Layout>
)

export default MaybeApiGuide
