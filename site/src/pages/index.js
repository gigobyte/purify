import React from 'react'
import Link from 'gatsby-link'
import styled from 'styled-components'
import Meta from '../components/Meta'
import Layout from '../components/Layout'
import ScaleLeap from '../assets/scaleleap'
import SellMyCode from '../assets/sellmycode'
import Schiphol from '../assets/schiphol'

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
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: white;
  text-align: center;
  height: 94px;
  font-size: 14px;

  @media only screen and (max-width: 768px) {
    position: relative;
    background-color: #fbfbfb;
    height: initial;
    line-height: initial;
    padding-bottom: 10px;
  }

  a {
    margin-right: 15px;
  }

  img {
    height: 33px;
  }
`

const FeatureTitle = styled.h3``

const WhoIsUsing = styled.h4`
  margin: 0;
  padding: 12px 0;
`

const IndexPage = (props) => (
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
              title="Purify is developed and maintained by Stanislav Iliev, distributed under the ISC License."
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
      </Content>
      <Footer>
        <WhoIsUsing>Who's using purify?</WhoIsUsing>
        <a href="https://www.scaleleap.com/">
          <ScaleLeap />
        </a>
        <a href="https://www.cargosnap.com/">
          <img
            alt="CargoSnap"
            src="https://user-images.githubusercontent.com/5529244/104025717-52883f00-51c5-11eb-9029-1a220abe9d26.png"
          />
        </a>
        <a href="https://codegrade.com/">
          <img
            alt="CodeGrade"
            src="https://user-images.githubusercontent.com/12597247/114862749-32cd6c00-9def-11eb-9af2-25424905557e.png"
          />
        </a>
        <a href="https://aspirehealthcare.com/">
          <img
            alt="Aspire Health"
            src="https://user-images.githubusercontent.com/7232302/125361920-a706a580-e333-11eb-9ab4-8f202bf1f4f2.png"
          />
        </a>
        <a href="https://www.schiphol.nl/">
          <Schiphol />
        </a>
        <a href="https://www.placemark.io/">
          <img
            style={{ height: 22, paddingBottom: 6 }}
            alt="Placemark"
            src="https://uploads-ssl.webflow.com/616710b6615e31b168d6e9b9/616711469d8fce3a2abfd02c_logo.svg"
          />
        </a>
        <a href="https://robinpowered.com/">
          <img
            alt="Robin"
            src="https://cdn.prod.website-files.com/632a1c3a87ee2760b99c5b3c/632afa9a5824af963e7fa165_robin_logo.svg"
          />
        </a>
        <a href="https://sellmycode.io/">
          <SellMyCode />
        </a>
      </Footer>
    </Container>
  </Layout>
)

export default IndexPage
