<h3 align="center">
  <img align="center" src="assets/logo.png" alt="List logo" width=200 />
</h3

<a href="https://travis-ci.org/gigobyte/pure"><img src="https://travis-ci.org/gigobyte/pure.svg?branch=master" alt="Build Status"></a>

<h1>What is <i>pure</i>?</h1>
        <i>Pure</i> is a library for functional programming in TypeScript.
        It's purpose is to allow developers to use popular patterns and abstractions that are available in most functional languages.
        It is also <a href="https://github.com/fantasyland/fantasy-land">Fantasy Land</a> conformant.
        <h1>Core values</h1>
        <ul>
            <li>
                <b>Elegant and developer-friendly API</b> - <i>pure</i>'s design decisions are made with developer experience in mind.
                <i>Pure</i> doesn't try to change how you write TypeScript, instead it provides useful tools for making your code easier to
                read and maintain without resolving to hacks or scary type definitions.  
            </li>
            <li>
                <b>Type-safety</b> - While <i>pure</i> can be used in vanilla JavaScript, it's entirely written with TypeScript and type safety in mind.
                While TypeScript does a great job at preventing runtime errors, <i>pure</i> goes a step further and provides utility functions for working
                with native objects like arrays in a type-safe manner.
            </li>
            <li>
                <b>Emphasis on practical code</b> - Higher-kinded types and other type-level features would be great additions to this library,
                but as of right now they don't have reasonable implementations in TypeScript. <i>Pure</i> focuses on being a library that you can
                include in any TypeScript project and favors instance methods instead of functions, clean and readable type definitions instead of
                advanced type features and a curated API instead of trying to port over another language's standard library.
            </li>
        </ul>
        <h1>How to start?</h1>
        <i>Pure</i> is available as a package on npm. You can install it with a package manager of your choice:
        ```javascript
          $ npm install pure-ts
        ```
        ```javascript
          $ yarn add pure-ts
        ```
        On the left sidebar you can find all of <i>pure</i>'s contents, each page contains a guide on how to start using it. <br />
        You can start by visiting the page about <a href="/adts/Maybe">Maybe</a>, one of the most popular data types.

# Documentation

You can find the documentation on the [official site](https://gigobyte.github.io/pure/).

# Inspired by

* Haskell
* [Arrow - Functional companion to Kotlin's Standard Library](http://arrow-kt.io/)
* [fp-ts - Functional programming in TypeScript](https://github.com/gcanti/fp-ts)
* [typical - playground for type-level primitives in TypeScript](https://github.com/tycho01/typical/)
