import React from 'react'
import Link from 'gatsby-link'
import styled from 'styled-components'
import DataTypeMethod from './DataTypeMethod'
import SyntaxHighlighter from 'react-syntax-highlighter'
import highlightStyle from 'react-syntax-highlighter/dist/esm/styles/hljs/googlecode'
import Layout from './Layout'

const Container = styled.div``

const Title = styled.h1`
  font-weight: inherit;

  @media only screen and (max-width: 768px) {
    text-align: center;
    margin-top: 0;
  }
`

const Description = styled.div`
  padding-right: 15%;
  font-size: 1.05em;

  @media only screen and (max-width: 768px) {
    padding-right: 0;
    text-align: center;
  }
`

const TopicHeader = styled.h2`
  font-weight: inherit;
  margin-bottom: 0;

  @media only screen and (max-width: 768px) {
    text-align: center;
  }
`
const TypeclassBadges = styled.div`
  margin-top: -20px;
  padding-bottom: 20px;
  display: flex;
  flex-wrap: wrap;

  @media only screen and (max-width: 768px) {
    justify-content: center;
  }
`

const TypeclassBadge = styled.span`
  background-color: #af87e6;
  border-radius: 6px;
  color: white;
  padding: 0px 5px;
  font-size: 13px;
  margin-right: 4px;
  margin-bottom: 5px;
  text-decoration: none;
`

const TypeclassTooltip = styled.div`
  background-color: #975ce7;
  border-radius: 100%;
  width: 17px;
  position: relative;
  height: 17px;
  margin-top: 1px;
  margin-left: 4px;

  &::after {
    content: '?';
    color: white;
    position: absolute;
    left: 5px;
    top: -2px;
    font-size: 13px;
  }

  @media (hover: none) {
    display: none;
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

const Guide = styled(Link)`
  display: inline-block;
  text-align: center;
  text-decoration: none;
  width: 100%;

  &:not(:last-of-type) {
    border-bottom: 1px solid #f3eeee;
  }
`

const DataTypeContent = (adt) => (props) => (
  <Layout location={props.location}>
    <Container>
      <Title>{adt.name}</Title>
      <TypeclassBadges>
        {adt.implements.map((typeclass) => (
          <TypeclassBadge key={typeclass}>{typeclass}</TypeclassBadge>
        ))}
        {adt.implements.length > 0 && (
          <TypeclassTooltip title="The badges on the left list all available fantasy-land instances for this data type" />
        )}
      </TypeclassBadges>
      <Description>{adt.description}</Description>
      <ExamplesContainer>
        {adt.examples.map((example) => (
          <Example>
            <ExampleHeader>{example.title}</ExampleHeader>
            <SyntaxHighlighter language="javascript" style={highlightStyle}>
              {example.content.join('\n')}
            </SyntaxHighlighter>
          </Example>
        ))}
        {adt.guides.length > 0 && (
          <Example>
            <ExampleHeader>Official Guides</ExampleHeader>
            {adt.guides.map((guide) => (
              <Guide to={guide.link}>{guide.title}</Guide>
            ))}
          </Example>
        )}
      </ExamplesContainer>
      {adt.content.map((x) => (
        <>
          <TopicHeader>{x.title}</TopicHeader>
          {x.methods.map((method) => DataTypeMethod(x.id, method))}
        </>
      ))}
    </Container>
  </Layout>
)

export default DataTypeContent
