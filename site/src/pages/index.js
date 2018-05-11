import React from 'react'
import Link from 'gatsby-link'
import styled from 'styled-components'

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
    color: white;
    font-size: 22px;
    align-self: center;
    padding: 0 10px;

    > a {
        text-decoration: none;

        :-webkit-any-link {
            color: white;
        }
    }
`

const Content = styled.div`
    text-align: center;
    background-color: #fbfbfb;
    height: 100%;
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

const FeatureTitle = styled.h3`
`

const IndexPage = () =>
    <Container>
        <NavBar>
            <NavBarLink><Link to="/adts/Maybe">Docs</Link></NavBarLink>
            <NavBarLink><a href="https://github.com/gigobyte/pure">Github</a></NavBarLink>
        </NavBar>
        <Content>
            <Heading>
                <Title>Pure</Title>
                <Subtitle>Functional programming standard library for TypeScript</Subtitle>
                <InstallBox>
                     $ npm install pure-ts
                </InstallBox>
            </Heading>
            <FeaturesContainer>
                <Feature>
                    <FeatureTitle>Algebraic Data Types</FeatureTitle>
                    Easily separate conditional logic and error handling with ADTs like Maybe and Either
                </Feature>
                <Feature>
                    <FeatureTitle>Typeclasses</FeatureTitle>
                    Implement instances of common typeclasses like Functor and Monad for your own data structures
                </Feature>
                <Feature>
                    <FeatureTitle>Utility functions</FeatureTitle>
                    Avoid code duplication by making use of pure's utility functions and combinators
                </Feature>
            </FeaturesContainer>
        </Content>
    </Container>

export default IndexPage
