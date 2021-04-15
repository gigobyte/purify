import React from 'react'
import styled from 'styled-components'
import Link from 'gatsby-link'
import Layout from '../../components/Layout'
import SyntaxHighlighter from 'react-syntax-highlighter'
import highlightStyle from 'react-syntax-highlighter/dist/esm/styles/hljs/googlecode'
import { HL } from '../../components/HL'

const Title = styled.h1`
  margin-bottom: 0;
`

const Subtitle = styled.div`
  padding-bottom: 30px;
`

const Topic = styled.h2`
  font-weight: normal;
`

const TopicDescription = styled.div`
  padding-right: 15%;

  @media only screen and (max-width: 768px) {
    padding-right: 0;
  }
`

const v015 = (props) => (
  <Layout location={props.location}>
    <Title>Purify v0.15</Title>
    <Subtitle>April 30, 2020</Subtitle>
    <div>
      Not sure what purify is? Check out the{' '}
      <Link to="/getting-started">Getting Started</Link> page. Also check out
      the <Link to="/faq">FAQ</Link> page!
      <br />
    </div>
    <Topic>
      <span style={{ color: '#d22626' }}>Breaking change</span> inside Codec
    </Topic>
    <TopicDescription>
      <Link to="/util/Codec">Codec</Link> had a <HL>undefinedType</HL> codec
      which was insufficient as there was no way to create optional properties
      on an object.
      <br />
      This was brought up in an issue and to resolve this I removed this codec
      in favor of a <HL>optional</HL> combinator, please check out{' '}
      <Link to="/utils/Codec#optional">the docs</Link> on how to use it.
    </TopicDescription>
    <Topic>An updated Either/MaybeAsync API</Topic>
    <TopicDescription>
      When I first started designing the API for Either and MaybeAsync I wanted
      to bring the ease of use of proper error handling within IO, just like it
      is in languages with do-notation and for-comprehensions.
      <br /> That's why the original API in version{' '}
      <Link to="/changelog/0.12">0.12</Link> only worked with async/await and I
      thought and this will be enough for most people.
      <br />
      Turns out most people started creating wrappers to make it more chainable
      and issues started piling in GitHub, no one liked the "imperative" API.
      <br />
      That's why I decided to spend some time brainstorming a new API, that
      didn't force people to use async/await, and this is the result:
      <SyntaxHighlighter language="javascript" style={highlightStyle}>
        {`// async/await
const deleteUser = (req) =>
    EitherAsync(async ({ liftEither, fromPromise, throwE }) => {
       const request  = await liftEither(validateRequest(req))

       try {
           const user = await fromPromise(getUser(request.userId))
       } catch {
           throwE(Error.UserDoesNotExist)
       }

       return deleteUserDb(user)
    })`}
      </SyntaxHighlighter>
      <SyntaxHighlighter language="javascript" style={highlightStyle}>
        {`// new API
const deleteUser = (req) =>
    liftEither(validateRequest(req))
        .chain(request => fromPromise(() => getUser(request.userId)))
        .mapLeft(_     => Error.UserDoesNotExist)
        .chain(user    => liftPromise(() => deleteUserDb(user)))`}
      </SyntaxHighlighter>
      This is stripped down version of the code, just to demonstrate the
      similarities, for the full version check out the updated documentation of{' '}
      <Link to="/adts/EitherAsync">EitherAsync</Link> and{' '}
      <Link to="/adts/MaybeAsync">MaybeAsync</Link>.<br />
      Both APIs will exist simultaneously and you're free to use whichever you
      like, much like how you can use both async/await and Promise.then.
    </TopicDescription>
    <Topic>Other changes</Topic>
    <TopicDescription>
      <ul>
        <li>
          Added a new <HL>Either#swap</HL> method
        </li>
      </ul>
    </TopicDescription>
  </Layout>
)

export default v015
