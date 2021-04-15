import React from 'react'
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

const UtilContent = (util) => (props) => (
  <Layout location={props.location}>
    <Container>
      <Title>{util.name}</Title>
      <Description>{util.description}</Description>
      <ExamplesContainer>
        <Example>
          <ExampleHeader>How to import</ExampleHeader>
          <SyntaxHighlighter language="javascript" style={highlightStyle}>
            {util.example.import}
          </SyntaxHighlighter>
        </Example>
        {util.example.before && (
          <Example>
            <ExampleHeader>Without {util.name}</ExampleHeader>
            <SyntaxHighlighter language="javascript" style={highlightStyle}>
              {util.example.before.join('\n')}
            </SyntaxHighlighter>
          </Example>
        )}
        {util.example.after && (
          <Example>
            <ExampleHeader>With {util.name}</ExampleHeader>
            <SyntaxHighlighter language="javascript" style={highlightStyle}>
              {util.example.after.join('\n')}
            </SyntaxHighlighter>
          </Example>
        )}
      </ExamplesContainer>
      {util.content.map((x) => (
        <>
          <TopicHeader>{x.title}</TopicHeader>
          {x.methods.map((method) => DataTypeMethod(x.id, method))}
        </>
      ))}
    </Container>
  </Layout>
)

export default UtilContent
