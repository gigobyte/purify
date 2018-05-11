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
const TypeclassBadges = styled.div`
    margin-top: -20px;
    padding-bottom: 20px;
    display: flex;
    flex-wrap: wrap;

    @media only screen and (max-width : 768px) {
        justify-content: center;
    }
`

const TypeclassBadge = styled(Link)`
    background-color: #af87e6;
    border-radius: 6px;
    color: white;
    padding: 0px 5px;
    font-size: 13px;
    margin-right: 4px;
    margin-bottom: 5px;
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
`

const DataTypeContent = adt => () =>
    <Container>
        <Title>{adt.name}</Title>
        <TypeclassBadges>
            {adt.implements.map(typeclass =>
                <TypeclassBadge key={typeclass} to={`/typeclasses/${typeclass}`}>{typeclass}</TypeclassBadge>
            )}
        </TypeclassBadges>
        <Description>{adt.description}</Description>
        <SyntaxHighlighter language="javascript" style={highlightStyle}>{adt.example.join('\n')}</SyntaxHighlighter>   
        <TopicHeader>Constructors</TopicHeader>
        {adt.constructors.map(DataTypeMethod)}
        <TopicHeader>Static methods</TopicHeader>
        {adt.staticMethods.map(DataTypeMethod)}
        <TopicHeader>Instance methods</TopicHeader>
        {adt.instanceMethods.map(DataTypeMethod)}
    </Container>

export default DataTypeContent