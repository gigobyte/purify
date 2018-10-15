import React from 'react'
import styled from 'styled-components'
import Layout from '../../components/layout'
import HL from '../../components/HL'
import SyntaxHighlighter from 'react-syntax-highlighter'
import highlightStyle from 'react-syntax-highlighter/styles/hljs/googlecode'

const MigratingToMaybe = props =>
    <Layout location={props.location}>
        <h1>Migrating old code to purify using Maybe</h1>
        In this guide we will take a look at purify's extensive Maybe API for working with old code that uses/expects nullable values.

        <h3>Scenario #1 - Wrapping nullable values for easier transformation with Maybe</h3>
        Let's imagine you have a function with the following signature: <HL>foo = (): object | null</HL>. <br />
        Our little <HL>foo</HL> function has over a hundred references, it's essential to implementing anything in your codebase. <br />
        You've been given the task of implementing some new feature and now that you know about purify you'll hate having to deal with null checks. <br />
        You can't change <HL>foo</HL>'s implementation to something that uses Maybe because that would mean changing a lot of code and the management needs that feature as soon as possible. <br />
        So what options do you have? <br />

        <h3>Solution #1 - Maybe.fromNullable, Maybe.fromFalsy and Maybe.fromPredicate + Maybe#extract</h3>

        <SyntaxHighlighter language="typescript" style={highlightStyle}>
         {`const foo = (): object | null => ...
         
const processFoo = () =>
    Maybe.fromNullable(foo())
        .map(x => ...)
        .chain(x => ...)
        .orDefault(...)
`}
        </SyntaxHighlighter>

        Our <HL>processFoo</HL> function still takes advantage of all Maybe features but it doesn't leak Maybe anywhere outside of its scope. <br />
        <HL>Maybe.fromNullable</HL> and <HL>Maybe.fromFalsy</HL> are very useful for quickly wrapping a nullable value into a Maybe so they're the most commonly used function <br />
        when migrating old code.
        In case the function we are writing is supposed to be consumed by something else that expects nullable values we can just unwrap our Maybe so that everything stays compatible:

        <SyntaxHighlighter language="typescript" style={highlightStyle}>
         {`const transformFoo = (): object | null =>
    Maybe.fromNullable(foo())
        .map(x => ...)
        .extract()
`}
        </SyntaxHighlighter>

        <HL>Maybe#extract</HL> is an instance method that allows you to turn any Maybe into a nullable value. <br /><br />
        Please note that while you may be tempted to wrap and unwrap manually every time you encounter a nullable value, the methods we are discussing <br />
        are only meant to be used for compatibility reasons. Code designed with Maybe in mind is easier to maintain and use in the long term.
    </Layout>

export default MigratingToMaybe