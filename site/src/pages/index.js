import React from 'react'
import Link from 'gatsby-link'
import styled from 'styled-components'
import Meta from '../components/Meta'
import Layout from '../components/Layout'
import SyntaxHighlighter from 'react-syntax-highlighter'
import highlightStyle from 'react-syntax-highlighter/styles/hljs/tomorrow'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const Title = styled.h1`
  margin: 0;
  font-style: italic;
`

const Subtitle = styled.h2`
  margin: 0;
  padding: 0 10px;

  @media only screen and (max-width: 768px) {
    font-size: 19px;
  }
`

const NavBar = styled.div`
  background-color: #3b74d7;
  height: 60px;
  min-height: 60px;
  display: flex;
  justify-content: flex-end;
  padding-right: 80px;

  @media only screen and (max-width: 768px) {
    justify-content: center;
    padding-right: 0;

    height: 50px;
    min-height: 50px;
  }
`

const NavBarLink = styled.span`
  color: white !important;
  font-size: 22px;
  align-self: center;
  padding: 0 10px;

  > a {
    text-decoration: none;

    &:-webkit-any-link {
      color: white !important;
    }

    &:link,
    &:visited,
    &:focus,
    &:hover,
    &:active {
      color: white;
    }
  }
`

const Content = styled.div`
  text-align: center;
  background-color: #fbfbfb;
  height: 100%;

  @media only screen and (max-width: 768px) {
    padding-bottom: 25px;
    height: initial;
  }
`

const Heading = styled.div`
  padding-top: 4%;
`

const InstallBox = styled.div`
  padding: 12px 0;
  margin: 10px 0;
  background-color: white;
  border-top: 1px dashed #3b74d7;
  border-bottom: 1px dashed #3b74d7;
`

const FeaturesContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`

const Feature = styled.div`
  flex: 1;
  padding: 0 10px;
  max-width: 380px;

  @media only screen and (max-width: 768px) {
    flex-basis: 100%;
  }
`

const Footer = styled.div`
  text-align: center;
  height: 40px;
  line-height: 40px;
  font-size: 14px;

  @media only screen and (max-width: 768px) {
    background-color: #fbfbfb;
    height: initial;
    line-height: initial;
    padding-bottom: 10px;
  }
`

const FeatureTitle = styled.h3``

const RefactoringContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  padding-top: 25px;

  pre {
    text-align: left;
    align-self: center;
    font-size: 12px;
    background-color: rgba(0, 0, 0, 0.02) !important;
    border-radius: 5px;
    padding: 1em !important;
  }
`

const RefactoringText = styled.div`
  align-self: center;
  font-size: 27px;
  padding: 0 20px;
`

const IndexPage = props => (
  <Layout location={props.location}>
    <Container>
      <Meta />
      <NavBar>
        <NavBarLink>
          <Link to="/getting-started">Docs</Link>
        </NavBarLink>
        <NavBarLink>
          <a href="https://github.com/gigobyte/purify">Github</a>
        </NavBarLink>
      </NavBar>
      <Content>
        <Heading>
          <Title>
            <img
              src="https://raw.githubusercontent.com/gigobyte/purify/master/assets/logo.png"
              alt="Purify"
            />
          </Title>
          <Subtitle>Functional programming library for TypeScript</Subtitle>
          <InstallBox>$ npm install purify-ts</InstallBox>
        </Heading>
        <FeaturesContainer>
          <Feature>
            <FeatureTitle>Not just a port</FeatureTitle>
            For purify, bringing popular patterns doesn't mean copying the
            implementation down to the last details, it means expressing ideas
            in the cleanest way possible using the tools of the language
          </Feature>
          <Feature>
            <FeatureTitle>Algebraic Data Types</FeatureTitle>
            Purify provides a collection of algebraic data structures that will
            help you tackle common problems that increase code complexity, such
            as conditional logic and error handling
          </Feature>
          <Feature>
            <FeatureTitle>Practical approach</FeatureTitle>
            Purify is a library focused on practical functional programming in
            TypeScript. You will find many examples and tutorials in the{' '}
            <Link to="/getting-started">docs</Link> section of this site.
          </Feature>
        </FeaturesContainer>
        <RefactoringContainer>
          <RefactoringText>Turn</RefactoringText>
          <SyntaxHighlighter language="javascript" style={highlightStyle}>
            {`const getUsers = (country?: Country): User[] => {
    if (!country) {
        return []
    }

    const users = getUsersByCountry(country)

    if (!users) {
        return []
    }

    return users
}`}
          </SyntaxHighlighter>
          <RefactoringText>into</RefactoringText>
          <SyntaxHighlighter language="javascript" style={highlightStyle} show>
            {`import { Maybe } from 'purify-ts/Maybe'

const getUsers = (country?: Country): User[] =>
    Maybe.fromNullable(country)
         .chain(getUsersByCountry)
         .orDefault([])`}
          </SyntaxHighlighter>
        </RefactoringContainer>
      </Content>
      <Footer>
        Purify is developed and maintained by Stanislav Iliev, distributed under
        the ISC License.
      </Footer>
    </Container>
  </Layout>
)

export default IndexPage
