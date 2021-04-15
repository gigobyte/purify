import React from 'react'
import styled from 'styled-components'
import Link from 'gatsby-link'
import Layout from '../../components/Layout'
import SyntaxHighlighter from 'react-syntax-highlighter'
import highlightStyle from 'react-syntax-highlighter/dist/esm/styles/hljs/googlecode'

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

const v014 = (props) => (
  <Layout location={props.location}>
    <Title>Purify v0.14</Title>
    <Subtitle>December 16, 2019</Subtitle>
    <div>
      Not sure what purify is? Check out the{' '}
      <Link to="/getting-started">Getting Started</Link> page. Not sure if you
      want to introduce purify as a dependency to your project? Check out the{' '}
      <Link to="/faq">FAQ</Link> page!
      <br />
    </div>

    <Topic>New Codec module</Topic>
    <TopicDescription>
      Purify now has a JSON validation/deserialization module called Codec. It's
      inspired by JSON decoders and encoders from Elm and various TypeScript
      libraries like io-ts and runtypes.
      <br />
      <Link to="/utils/Codec">Check it out!</Link>
    </TopicDescription>

    <Topic>New, optimized build</Topic>
    <TopicDescription>
      In 0.13.1, the build target was changed to "es5" to support IE11 and other
      older browsers.
      <br /> To balance out all of the regressions that resulted from this
      (bigger bundle, slower performance) GitHub user{' '}
      <a href="https://github.com/imcotton">imcotton</a> added an ES6 build
      <br />
      which you can now use as of 0.14 if your project runs on the server or you
      don't care about browser compatibility.
      <br />
      <SyntaxHighlighter language="javascript" style={highlightStyle}>
        {`//Before
import { Either } from 'purify-ts/Either'

//After
import { Either } from 'purify-ts/es/Either'`}
      </SyntaxHighlighter>
      The new "es" build is 30% smaller and hopefully a little bit faster.
    </TopicDescription>

    <Topic>A lot of improvements to this site</Topic>
    <TopicDescription>
      Although this is not related to the update, this website received a lot of
      typo/stylistic fixes, examples and notes added, and some embarrassing
      copy-paste errors were removed.
    </TopicDescription>

    <Topic>Other changes</Topic>
    <TopicDescription>
      <ul>
        <li>
          The implementation of Either.lefts and Either.rights was refactored
        </li>
        <li>
          {`The Just constructor now returns the correct type (Maybe<T>) instead of Just<T>`}
        </li>
        <li>
          Added a .prettierrc file to the repository for consistency across
          contributions
        </li>
      </ul>
    </TopicDescription>
  </Layout>
)

export default v014
