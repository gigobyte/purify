import React from 'react'
import styled from 'styled-components'
import Layout from '../../components/layout'
import HL from '../../components/HL'
import SyntaxHighlighter from 'react-syntax-highlighter'
import highlightStyle from 'react-syntax-highlighter/styles/hljs/googlecode'

const Note = styled.div`
  display: inline-block;
  background-color: #fcf4cd;
  border: 0 solid #f7e070;
  border-left-width: 8px;
  padding: 10px;
  margin: 10px 0;
`

const MethodName = styled.a`
  font-size: 17px;
  font-weight: bold;
  color: #3b74d7;
  margin-top: 5px;
  display: inline-block;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

const MaybeApiGuide = props => (
  <Layout location={props.location}>
    <h1>Which Maybe method am I supposed to use now? (API guide)</h1>
    We've all been in that research phase where we're still learning the API of
    library and deciding if it suits our usecases. <br />
    The purpose of this guide is to make that process easier by grouping all
    available methods for the Maybe data type.
    <h3>
      Scenario #1 - I want to use Maybe but my codebase already has
      null/undefined all over the place
    </h3>
    One of purify's main goals is great interoperability with existing code.
    That is why the API for Maybe is rich in utility methods for working with
    nullable values. <br />
    <Note>
      One might question the usage of Maybe (and purify) if you are still going
      to use nulls, there are already a lot of utility libraries like ramda and
      lodash that allow you to do that. <br />
      With purify you can start using ubiquitous data structures that come with
      a lot of literature and examples in various programming languages <br />
      without sacrificing coding style or ease of interop, that's why using it
      instead of other libraries might be a good idea.
    </Note>
    <br />
    <MethodName href="/adts/Maybe/#fromNullable">
      Maybe.fromNullable
    </MethodName>{' '}
    / <MethodName href="/adts/Maybe/#fromFalsy">Maybe.fromFalsy</MethodName> /{' '}
    <MethodName href="/adts/Maybe/#fromPredicate">
      Maybe.fromPredicate
    </MethodName>{' '}
    / <MethodName href="/adts/Maybe/#encase">Maybe.encase</MethodName>
    <br />
    These methods allow you to construct Maybe values from, as the names
    suggest, nullable and falsy values or in the case of the `encase` method -
    from a function that may throw an exception. <br />
    `fromPredicate` is on the list because it can be used to cover all kinds of
    complicated checks, for example:
    <SyntaxHighlighter language="javascript" style={highlightStyle}>
      {`const _ = Maybe.fromPredicate(x => x && x.length > 0, value)`}
    </SyntaxHighlighter>
    <MethodName href="/adts/Maybe/#chainNullable">chainNullable</MethodName>
    <br />
    Now that you have constructed your Maybe out of an optional value, you may
    want to transform it with a function that returns yet another optional
    value. <br />
    If you are already familiar with the <HL>chain</HL> method (a.k.a.{' '}
    <HL>bind</HL>, <HL>flatMap</HL> or <HL>>>=</HL>) you may think of using it
    in combination with any of the methods mentioned above: <br />
    <SyntaxHighlighter language="javascript" style={highlightStyle}>
      {`myMaybe.chain(x => Maybe.fromNullable(transform(x)))`}
    </SyntaxHighlighter>
    There's nothing wrong with that approach, but there's a helper method called
    `chainNullable` that does exactly the same thing <br />
    without you having to manually construct a Maybe out of the return value of
    the transformation function. <br />
    <SyntaxHighlighter language="javascript" style={highlightStyle}>
      {`myMaybe.chainNullable(x => transform(x))
// or just straight up
myMaybe.chainNullable(transform)`}
    </SyntaxHighlighter>
    <MethodName href="/adts/Maybe/#extract">extract</MethodName> /{' '}
    <MethodName href="/adts/Maybe/#extractNullable">extractNullable</MethodName>{' '}
    / <MethodName href="/adts/Maybe/#unsafeCoerce">unsafeCoerce</MethodName>
    <br />
    Sometimes you have to interact with code that expects a nullable value, in
    that case you can just unwrap a Maybe down to a primitive value like null or
    undefined using the methods above. <br />
    <Note>
      Please note that while you may be tempted to wrap and unwrap manually
      every time you encounter a nullable value, <br />
      consider that code designed with Maybe in mind is easier to maintain and
      use in the long term. <br />
      Try to keep usage of the methods mentioned in this part of the guide low
      and only for compatibility reasons. <br />
      Don't be afraid to start returning or expecing Maybe values in functions,
      you'll notice some benefits you haven't considered before!
    </Note>
    <h3>Scenario #2 - I'm not sure how to check if a value exists or not</h3>
    *WIP*
    <h3>Scenario #3 - I want to transform the value inside the Maybe</h3>
    *WIP*
    <h3>
      Scenario #4 - I work with arrays a lot, are there any methods to help me
      with that?
    </h3>
    *WIP*
  </Layout>
)

export default MaybeApiGuide
