import React from 'react'
import styled from 'styled-components'
import Link from 'gatsby-link'
import data from '../data'
import DataTypeMethod from './DataTypeMethod'
import SyntaxHighlighter from 'react-syntax-highlighter'
import highlightStyle from 'react-syntax-highlighter/styles/hljs/googlecode'

const Container = styled.div`
`

const Title = styled.h1`
    font-weight: inherit;

    @media only screen and (max-width : 768px) {
        text-align: center;
        margin-top: 0;
    }
`

const AdtBadges = styled.div`
    margin-top: -20px;
    padding-bottom: 20px;
    display: flex;
    flex-wrap: wrap;

    @media only screen and (max-width : 768px) {
        justify-content: center;
    }
`

const AdtBadge = styled(Link)`
    background-color: #d6eeff;
    border-radius: 6px;
    color: #2877ad;
    padding: 0px 5px;
    font-size: 13px;
    margin-right: 4px;
    margin-bottom: 5px;
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
`

const Description = styled.div`
    padding-right: 15%;
    font-size: 1.05em;

    @media only screen and (max-width : 768px) {
        padding-right: 0;
        text-align: center;
    }
`

const TopicHeader = styled.h2`
    font-weight: inherit;
    margin-bottom: 0;

    @media only screen and (max-width : 768px) {
        text-align: center;
    }
`

const ExamplesContainer = styled.div`
    pre {
        margin: 0;
    }
`

const ExampleHeader = styled.div`
    text-align: center;
    background-color: #f9f4f4;
    padding: 4px;
`

const Example = styled.div`
    max-width: 650px;
    margin: 10px 0;
    border: 1px solid #f3eeee;
`

const TypeclassContent = typeclass => () =>
    <Container>
        <Title>{typeclass.name}</Title>
        <AdtBadges>
            {typeclass.implementedBy.map(adt =>
                <AdtBadge key={adt} to={`/adts/${adt}`}>{adt}</AdtBadge>
            )}
        </AdtBadges>
        <Description>{typeclass.description}</Description>
        <ExamplesContainer>
            <Example>
                <ExampleHeader>How to import</ExampleHeader>
                <SyntaxHighlighter language="typescript" style={highlightStyle}>{typeclass.example.import}</SyntaxHighlighter>
            </Example>
        </ExamplesContainer>
        {typeclass.methods.length > 0 &&
            <TopicHeader>Methods to implement</TopicHeader>
        }
        {typeclass.methods.map(DataTypeMethod)}
    </Container>

export default TypeclassContent