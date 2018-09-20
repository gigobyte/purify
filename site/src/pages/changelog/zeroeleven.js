import React from 'react'
import styled from 'styled-components'
import Link from 'gatsby-link'
import SyntaxHighlighter from 'react-syntax-highlighter'
import highlightStyle from 'react-syntax-highlighter/styles/hljs/googlecode'

const Title = styled.h1`
    margin-bottom: 0;
`

const Subtitle = styled.div`
    padding-bottom: 30px;
`

const Topic = styled.h2`
    font-weight: normal
`

const TopicDescription = styled.div`
    padding-right: 15%;

    @media only screen and (max-width: 768px) {
        padding-right: 0;
    }
`

const HL = styled.span`
    background: white;
    padding: 0.5em;
    font-family: monospace;
    white-space: pre;
`

const v011 = () => (
    <div>
        <Title>Purify v0.11</Title>
        <Subtitle>September 20, 2018</Subtitle>
        <div>Not sure what purify is? Check out the <Link to="/getting-started">Getting Started</Link> page.</div>

        <Topic>NonEmptyList</Topic>
        <TopicDescription>
            The new NonEmptyList ADT is a list that is guaranteed to have at least one value. Because of it's utility there is an implementation of this data structure in pretty much all ML languages, which is why it's now a part of purify too. Let's look at some example code:
            <SyntaxHighlighter language="typescript" style={highlightStyle}>
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
const numbers: number[] = await fetchArrayFromBackend()
const randEl: Maybe<number> = NonEmptyList.fromArray(numbers).map(getRandomElement)
                `}
            </SyntaxHighlighter>
        </TopicDescription>

        <Topic>Maybe and Either predicates narrow the type</Topic>
        <TopicDescription>
            v0.11 makes a lot of improvements to type safety. Using one of TypeScript's more unique features - type predicates, the compiler can now know when it's safe to extract a value from a Maybe or Either.
            <SyntaxHighlighter language="typescript" style={highlightStyle}>
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
            You can now use a wildcard when pattern matching a Maybe, Either or any other ADT that supports pattern matching.

            <SyntaxHighlighter language="typescript" style={highlightStyle}>
                {` // v0.10
adt.caseOf({ Just: _value => 0, Nothing: () => 0})

// Now
adt.caseOf({ _ => 0 })`}
            </SyntaxHighlighter>
        </TopicDescription>

        <Topic>Tuple support for more array behaviour</Topic>
        <TopicDescription>Tuples now implement the Iterable and ArrayLike interfaces, making them applicable to more use cases.</TopicDescription>

        <SyntaxHighlighter language="typescript" style={highlightStyle}>
                {` const [ fst, snd ] = Tuple(1, 2)`}
            </SyntaxHighlighter>

        <Topic>New Maybe and Either methods</Topic>
        <TopicDescription>
            Check out the docs for Maybe and Either to find out more about those methods.

            <ul>
                <li><HL>Maybe.fromPredicate</HL>, <HL>Maybe#join</HL> and <HL>Maybe#orDefaultLazy</HL></li>
                <li><HL>Either#join</HL> and <HL>Either#orDefaultLazy</HL></li>
            </ul>
        </TopicDescription>
    </div>
)

export default v011