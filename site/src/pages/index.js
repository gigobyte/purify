import React from 'react'
import Link from 'gatsby-link'
import styled from 'styled-components'
import Meta from '../components/Meta'

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

    @media only screen and (max-width : 768px) {
        font-size: 19px;
    }
`

const NavBar = styled.div`
    background-color: #007acc;
    height: 60px;
    min-height: 60px;
    display: flex;
    justify-content: flex-end;
    padding-right: 80px;

    @media only screen and (max-width : 768px) {
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

        &:link, &:visited, &:focus, &:hover, &:active {
            color: white;
        }
    }
`

const Content = styled.div`
    text-align: center;
    background-color: #fbfbfb;
    height: 100%;

    @media only screen and (max-width : 768px) {
        padding-bottom: 25px;
        height: initial;
    }
`

const Heading = styled.div`
    padding-top: 5%;
`

const InstallBox = styled.div`
    padding: 12px;
    margin: 10px;
    background-color: white;
    border: 1px dashed #007acc;
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

    @media only screen and (max-width : 768px) {
        flex-basis: 100%;
    }
`

const Footer = styled.div`
    text-align: center;
    height: 40px;
    line-height: 40px;
    font-size: 14px;

    @media only screen and (max-width : 768px) {
        background-color: #fbfbfb;
        height: initial;
        line-height: initial;
        padding-bottom: 10px;
    }
`

const FeatureTitle = styled.h3`
`

const IndexPage = () =>
    <Container>
        <Meta />
        <NavBar>
            <NavBarLink><Link to="/getting-started">Docs</Link></NavBarLink>
            <NavBarLink><a href="https://github.com/gigobyte/pure">Github</a></NavBarLink>
        </NavBar>
        <Content>
            <Heading>
                <Title>Pure</Title>
                <Subtitle>Functional programming library for TypeScript</Subtitle>
                <InstallBox>
                     $ npm install pure-ts
                </InstallBox>
            </Heading>
            <FeaturesContainer>
                <Feature>
                    <FeatureTitle>Utility functions</FeatureTitle>
                    <i>Pure</i> provides implementations for common typeclasses like Functor and Monad, along with utility functions that operate on them
                </Feature>
                <Feature>
                    <FeatureTitle>Algebraic Data Types</FeatureTitle>
                    <i>Pure</i> provides a collection of algebraic data structures that will help you tackle common problems that increase code complexity, such as conditional logic and error handling
                </Feature>
                <Feature>
                    <FeatureTitle>Practical approach</FeatureTitle>
                    <i>Pure</i> is a library focused on practical functional programming in TypeScript. You will find many examples and tutorials in the docs section of this site.  
                </Feature>
            </FeaturesContainer>
        </Content>
        <Footer>
            Pure is developed and maintained by Stanislav Iliev, distributed under the ISC License.
        </Footer>
    </Container>

export default IndexPage
