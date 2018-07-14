import React from 'react'
import Link from 'gatsby-link'
import styled from 'styled-components'

const Container = styled.div`
    width: 50%;

    @media only screen and (max-width : 1024px) {
        width: 100%;
    }
`

const Console = styled.div`
    background-color: #283646;
    padding: 5px 10px;
    color: white;
    margin: 10px 0;
    border-radius: 4px;
`

const GettingStarted = () =>
    <Container>
        <h1>What is pure?</h1>
        Pure is a library for functional programming in TypeScript.
        It's purpose is to allow developers to use popular patterns and abstractions that are available in most functional languages.
        It is also <a href="https://github.com/fantasyland/fantasy-land">Fantasy Land</a> conformant.
        <h1>Core values</h1>
        <ul>
            <li>
                <b>Elegant and developer-friendly API</b> - pure's design decisions are made with developer experience in mind.
                Pure doesn't try to change how you write TypeScript, instead it provides useful tools for making your code easier to
                read and maintain without resolving to hacks or scary type definitions.  
            </li>
            <li>
                <b>Type-safety</b> - While pure can be used in vanilla JavaScript, it's entirely written with TypeScript and type safety in mind.
                While TypeScript does a great job at preventing runtime errors, pure goes a step further and provides utility functions for working
                with native objects like arrays in a type-safe manner.
            </li>
            <li>
                <b>Emphasis on practical code</b> - Higher-kinded types and other type-level features would be great additions to this library,
                but as of right now they don't have reasonable implementations in TypeScript. Pure focuses on being a library that you can
                include in any TypeScript project and favors instance methods instead of functions, clean and readable type definitions instead of
                advanced type features and a curated API instead of trying to port over another language's standard library.
            </li>
        </ul>
        <h1>How to start?</h1>
        Pure is available as a package on npm. You can install it with a package manager of your choice:
        <Console>
            $ npm install pure-ts <br />
            $ yarn add pure-ts
        </Console>
        On the left sidebar you can find all of pure's contents, each page contains a guide on how to start using it. <br />
        You can start by visiting the page about <Link to="/adts/Maybe">Maybe</Link>, one of the most popular data types.
    </Container>

export default GettingStarted