import React from 'react'
import styled from 'styled-components'
import { Highlight } from './HL'

const Container = styled.div`
  padding: 15px 0px;
  border-bottom: 1px solid #b8d1e2;
  border-style: dashed;
  border-left: 0;
  border-top: 0;
  border-right: 0;
`

const MethodName = styled.a`
  font-size: 19px;
  color: #3b74d7;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  @media only screen and (max-width: 768px) {
    display: block;
    text-align: center;
    padding-bottom: 5px;
  }
`

const MethodSignature = styled.span`
  display: inline-block;
  font-family: Consolas, Menlo, monospace;
  background-color: #e7edf1;
  border-radius: 4px;
  font-size: 0.8rem;
  margin-right: 10px;
  margin-bottom: 10px;

  &:before {
    content: ${(props) => (props.ml ? "'λ'" : "'TS'")};
    background-color: ${(props) => (props.ml ? '#9756f3' : '#3b74d7')};
    color: white;
    border-bottom-left-radius: 4px;
    border-top-left-radius: 4px;
    padding: 3px 5px;
    display: inline-block;
    min-width: 13px;
    text-align: center;
    letter-spacing: ${(props) => (props.ts ? '-1px' : '0')};
  }

  @media only screen and (max-width: 768px) {
    position: relative;
    text-align: center;
    width: 100%;
    margin-bottom: 0;
    padding: 5px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-top: 1px solid #dfe4e6;
    font-size: 13px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;

    &:before {
      position: absolute;
      left: 0;
      padding: 5px 5px;
      margin-top: -5px;
    }
  }
`

const MethodSignatureText = styled.span`
  padding: 0 6px;
`

const MethodExample = styled.div`
  display: flex;
  background-color: #f0f4ff;
  border-left: 4px solid #8acefb;
  padding: 5px;
  margin: 5px 0;
  overflow-x: scroll;
  max-width: calc(95vw - 200px);

  @media only screen and (max-width: 768px) {
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 100vw;
  }
`

const MethodExampleColumn = styled.div`
  display: flex;
  flex-direction: column;

  pre {
    border-radius: 2px;
    min-height: 20px;
    display: flex !important;
    justify-content: center;
    flex-direction: column;
    margin-bottom: 5px;
    margin-top: 0;
    background: #f1f5ff !important;
    padding: 0.3em 0.4em !important;

    &:last-child {
      margin-bottom: 0;
    }
  }
`

const MethodDescription = styled.div`
  width: 70%;

  @media only screen and (max-width: 768px) {
    width: 100%;
  }

  @media only screen and (max-width: 768px) {
    padding: 10px 0;
  }
`

const DataTypeMethod = (categoryId, method) => (
  <Container key={method.name}>
    <MethodName
      id={`${categoryId}-${method.name}`}
      href={`#${categoryId}-${method.name}`}
    >
      {method.name}
    </MethodName>
    <div>
      {method.signatureML && (
        <MethodSignature ml>
          <MethodSignatureText>{method.signatureML}</MethodSignatureText>
        </MethodSignature>
      )}
      {method.signatureTS && (
        <MethodSignature ts>
          <MethodSignatureText>{method.signatureTS}</MethodSignatureText>
        </MethodSignature>
      )}
      <MethodDescription>{method.description}</MethodDescription>
      {method.examples.length > 0 && (
        <MethodExample>
          <MethodExampleColumn>
            {method.examples.map((example) => (
              <Highlight key={example.input}>{example.input}</Highlight>
            ))}
          </MethodExampleColumn>

          <MethodExampleColumn>
            {method.examples.map((example) => (
              <Highlight key={example.input}>➔</Highlight>
            ))}
          </MethodExampleColumn>

          <MethodExampleColumn>
            {method.examples.map((example) => (
              <Highlight key={example.input}>{example.output}</Highlight>
            ))}
          </MethodExampleColumn>
        </MethodExample>
      )}
    </div>
  </Container>
)

export default DataTypeMethod
