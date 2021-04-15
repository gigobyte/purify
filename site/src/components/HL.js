import React from 'react'
import styled from 'styled-components'
import SyntaxHighlighter from 'react-syntax-highlighter'
import highlightStyle from 'react-syntax-highlighter/dist/esm/styles/hljs/googlecode'

export const HL = styled.span`
  background: white;
  padding: 0.5em;
  font-family: monospace;
  white-space: pre;
`

export const Highlight = ({ children }) => (
  <SyntaxHighlighter language="javascript" style={highlightStyle}>
    {children}
  </SyntaxHighlighter>
)
