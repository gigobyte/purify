import React from 'react'
import styled from 'styled-components'
import Link from 'gatsby-link'
import SyntaxHighlighter from 'react-syntax-highlighter'
import highlightStyle from 'react-syntax-highlighter/dist/esm/styles/hljs/googlecode'
import Layout from '../../components/Layout'
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

const v011 = (props) => (
  <Layout location={props.location}>
    <Title>Purify v0.11</Title>
    <Subtitle>September 20, 2018</Subtitle>
    <div>
      Not sure what purify is? Check out the{' '}
      <Link to="/getting-started">Getting Started</Link> page. The package was
      renamed from `pure-ts` because of NSFW search results.
    </div>

    <Topic>NonEmptyList</Topic>
    <TopicDescription>
      The new NonEmptyList ADT is a list that is guaranteed to have at least one
      value. Because of it's utility there is an implementation of this data
      structure in pretty much all ML languages, which is why it's now a part of
      purify too. Let's look at some example code:
      <SyntaxHighlighter language="javascript" style={highlightStyle}>
        {`import { NonEmptyList, head } from 'purify-ts/adts/NonEmptyList'

// Create functions with a contract - the caller has to verify that the input is valid instead of the callee
// Since the list parameter is guaranteed to have at least one element, this function will always return a value
const getRandomElement = <T>(list: NonEmptyList<T>): T =>
    list[Math.floor(Math.random() * list.length)]

// Doesn't compile
getRandomElement(NonEmptyList([]))

// Compiles, you don't need to check for elements if the list length is known at compile time
getRandomElement(NonEmptyList([1]))

// For runtime values, you have to deal with a Maybe
const numbers: number[] = getArrayFromForm()
const randEl: Maybe<number> = NonEmptyList.fromArray(numbers).map(getRandomElement)
                `}
      </SyntaxHighlighter>
    </TopicDescription>

    <Topic>Maybe and Either predicates narrow the type</Topic>
    <TopicDescription>
      v0.11 makes a lot of improvements to type safety. Using one of
      TypeScript's more unique features - type predicates, the compiler can now
      know when it's safe to extract a value from a Maybe or Either.
      <SyntaxHighlighter language="javascript" style={highlightStyle}>
        {`const sometimesValue: Maybe<number> = ...

sometimesValue.extract() // number | null

if (sometimesValue.isJust()) {
    // Because extract() is in a block that guarantees the presence of a value, it's safe to return a number instead of a nullable number
    sometimesValue.extract() // number
}
                `}
      </SyntaxHighlighter>
    </TopicDescription>

    <Topic>Wildcard pattern for pattern matching</Topic>
    <TopicDescription>
      You can now use a wildcard when pattern matching a Maybe, Either or any
      other ADT that supports pattern matching.
      <SyntaxHighlighter language="javascript" style={highlightStyle}>
        {` // v0.10
adt.caseOf({ Just: value => 0, Nothing: () => 0})

// Now
adt.caseOf({ _: () => 0 })`}
      </SyntaxHighlighter>
    </TopicDescription>

    <Topic>Tuple support for more array behaviour</Topic>
    <TopicDescription>
      Tuples now implement the Iterable and ArrayLike interfaces.
    </TopicDescription>

    <SyntaxHighlighter language="javascript" style={highlightStyle}>
      {` const [ fst, snd ] = Tuple(1, 2)`}
    </SyntaxHighlighter>

    <Topic>New Maybe and Either methods</Topic>
    <TopicDescription>
      Check out the docs for Maybe and Either to find out more about the
      following methods:
      <ul>
        <li>
          <HL>Maybe.fromPredicate</HL>, <HL>Maybe#join</HL> and{' '}
          <HL>Maybe#orDefaultLazy</HL>
        </li>
        <li>
          <HL>Either#join</HL> and <HL>Either#orDefaultLazy</HL>
        </li>
      </ul>
    </TopicDescription>

    <Topic>Improved pretty printing</Topic>
    <TopicDescription>
      When using <HL>toString</HL> on ADT instances now it displays the
      constructor name. Keep in mind that this behaviour is strictly for pretty
      printing, in the case of <HL>JSON.stringify</HL> it strips out any ADT
      info and leaves only relevant JSON data.
      <SyntaxHighlighter language="javascript" style={highlightStyle}>
        {`const val = Just(5)
console.log(val.toString()) // "Just(5)"
console.log(JSON.stringify(val)) // "5"`}
      </SyntaxHighlighter>
    </TopicDescription>

    <Topic>
      All functions with multiple arguments support partial application
    </Topic>
    <TopicDescription>
      <div>
        Added partial application support to: <HL>List#at</HL>
      </div>
      <div>
        Improved partial application for: <HL>Tuple.fanout</HL>,{' '}
        <HL>Maybe.mapMaybe</HL>
      </div>
    </TopicDescription>

    <Topic>Other changes</Topic>
    <TopicDescription>
      <ul>
        <li>
          Removed <HL>Semigroup</HL> and <HL>Ord</HL> instances because they
          were not sound and making them typesafe required using very confusing
          type definitions.
        </li>
        <li>
          Fixed <HL>Either#isRight</HL> type definition (thanks{' '}
          <a href="https://github.com/sledorze">sledorze</a>)
        </li>
        <li>
          Made the <HL>value</HL> property inside the Maybe class private
        </li>
        <li>Reduced package size by excluding the tests</li>
        <li>
          Many improvements (rewordings, corrections and clarifications) made to
          the docs (thanks <a href="https://github.com/squirly">squirly</a>)
        </li>
      </ul>
    </TopicDescription>
  </Layout>
)

export default v011
