import React from 'react'
import styled from 'styled-components'
import Layout from '../../components/Layout'
import { HL } from '../../components/HL'
import Link from 'gatsby-link'
import SyntaxHighlighter from 'react-syntax-highlighter'
import highlightStyle from 'react-syntax-highlighter/dist/esm/styles/hljs/googlecode'

export const Note = styled.div`
  display: inline-block;
  background-color: #fcf4cd;
  border: 0 solid #f7e070;
  border-left-width: 8px;
  padding: 10px;
  margin: 10px 0;
  overflow-x: auto;

  @media only screen and (max-width: 768px) {
    display: block;
  }
`

const MethodName = styled(Link)`
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

const SmallMethodName = styled(MethodName)`
  font-size: initial;
  font-weight: initial;
  margin-top: 0;
`

const MaybeApiGuide = (props) => (
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
      a lot of literature and examples in various programming languages (in this
      case Maybe) <br />
      without sacrificing coding style or ease of interop, that's why using it
      instead of other libraries might be a good idea.
    </Note>
    <br />
    <MethodName to="/adts/Maybe/#fromNullable">
      Maybe.fromNullable
    </MethodName> /{' '}
    <MethodName to="/adts/Maybe/#fromFalsy">Maybe.fromFalsy</MethodName> /{' '}
    <MethodName to="/adts/Maybe/#fromPredicate">Maybe.fromPredicate</MethodName>{' '}
    / <MethodName to="/adts/Maybe/#encase">Maybe.encase</MethodName>
    <br />
    These methods allow you to construct Maybe values from, as the names
    suggest, nullable and falsy values or in the case of the{' '}
    <SmallMethodName to="/adts/Maybe/#encase">encase</SmallMethodName> method -
    from a function that may throw an exception. <br />
    `fromPredicate` is on the list because it can be used to cover all kinds of
    complicated checks, for example:
    <SyntaxHighlighter language="javascript" style={highlightStyle}>
      {`const _ = Maybe.fromPredicate(x => x && x.length > 0, value)`}
    </SyntaxHighlighter>
    <MethodName to="/adts/Maybe/#chainNullable">chainNullable</MethodName>
    <br />
    Now that you have constructed your Maybe out of an optional value, you may
    want to transform it with a function that returns yet another optional
    value. <br />
    If you are already familiar with the{' '}
    <SmallMethodName to="/adts/Maybe/#chain">chain</SmallMethodName> method
    (a.k.a. <HL>bind</HL>, <HL>flatMap</HL> or <HL>>>=</HL>) you may think of
    using it in combination with any of the methods mentioned above: <br />
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
    <MethodName to="/adts/Maybe/#extract">extract</MethodName> /{' '}
    <MethodName to="/adts/Maybe/#extractNullable">extractNullable</MethodName> /{' '}
    <MethodName to="/adts/Maybe/#unsafeCoerce">unsafeCoerce</MethodName>
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
    There are numerous ways to check if a value exists with purify, but I want
    to focus on the fact that you rarely need to do so explicitly.
    <br />
    Try to split up your code into functions and then find ways to combine them
    using many of the available transformation methods like
    <br />
    <SmallMethodName to="/adts/Maybe/#map">Maybe#map</SmallMethodName> or{' '}
    <SmallMethodName to="/adts/Maybe/#chain">Maybe#chain</SmallMethodName> or{' '}
    <SmallMethodName to="/adts/Maybe/#extend">Maybe#extend</SmallMethodName> or{' '}
    <SmallMethodName to="/adts/Maybe/#filter">Maybe#filter</SmallMethodName>...
    you get the point.
    <br />
    There are so many methods you can chain so that your code is nice and
    declarative that you'll almost never have to unpack a Maybe and check
    manually.
    <br />
    There are some cases where that is needed though, let's go through them:{' '}
    <br /> <br />
    <MethodName to="/adts/Maybe/#isJust">Maybe#isJust</MethodName> /{' '}
    <MethodName to="/adts/Maybe/#isNothing">Maybe#isNothing</MethodName>
    <br />
    The most primitive of the bunch, these methods enable us to do JS-style
    checking if a value is missing or not.
    <br />
    The method names are pretty self-explanatory so we won't go into much
    details, but it's generally not recommend to use those methods.
    <br />
    Better choices are almost always available.
    <br />
    <br />
    <MethodName to="/adts/Maybe/#caseOf">Maybe#caseOf</MethodName> /{' '}
    <MethodName to="/adts/Maybe/#reduce">Maybe#reduce</MethodName>
    <br />
    <SmallMethodName to="/adts/Maybe/#caseOf">caseOf</SmallMethodName> is the
    go-to choice when none of the other methods seem good enough.
    <br />
    Since pattern matching is still not available (yet) in JavaScript, caseOf
    tries to mimic this behaviour, allowing you to branch your logic by asking
    you for two functions that will handle each case.
    <br />
    <SmallMethodName to="/adts/Maybe/#reduce">reduce</SmallMethodName> is very,
    very similar, in fact it's so similar that it looks almost useless. The goal
    of reduce is to provide an instance for the Foldable typeclass for Maybe.
    <br />
    If you like the minimalism of reduce and you don't care about Foldable or
    you haven't heard of it - no problem, you can use it instead of caseOf just
    fine!
    <br />
  </Layout>
)

export default MaybeApiGuide
