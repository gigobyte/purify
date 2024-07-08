<div align="center">
  <img src="assets/logo.png" alt="Purify logo" /> <br />
  
  [![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/gigobyte/purify/ci.yml?label=build&style=flat-square&branch=master)](https://github.com/gigobyte/purify/actions/workflows/ci.yml)
  ![Coveralls](https://img.shields.io/coverallsCoverage/github/gigobyte/purify?style=flat-square&color=brightGreen)
  [![TypeScript Version](http://img.shields.io/badge/built_with-TypeScript-brightgreen.svg?style=flat-square "Latest Typescript")](https://www.typescriptlang.org/download/)
  [![HitCount](https://hits.dwyl.com/gigobyte/purify.svg?style=flat-square)](http://hits.dwyl.com/gigobyte/purify)
  
</div>

# What is purify?

Purify is a library for functional programming in TypeScript.
Its purpose is to allow developers to use popular patterns and abstractions that are available in most functional languages.
It is also <a href="https://github.com/fantasyland/fantasy-land">Fantasy Land</a> conformant.

# Core values

- **Elegant and developer-friendly API** - purify's design decisions are made with developer experience in mind. Purify doesn't try to change how you write TypeScript, instead it provides useful tools for making your code easier to read and maintain without resolving to hacks or scary type definitions.

- **Type-safety** - While purify can be used in vanilla JavaScript, it's entirely written with TypeScript and type safety in mind. While TypeScript does a great job at preventing runtime errors, purify goes a step further and provides utility functions for working with native objects like arrays in a type-safe manner.

- **Emphasis on practical code** - Higher-kinded types and other type-level features would be great additions to this library, but as of right now they don't have reasonable implementations in TypeScript. Purify focuses on being a library that you can include in any TypeScript project and favors instance methods instead of functions, clean and readable type definitions instead of advanced type features and a curated API instead of trying to port over another language's standard library.

# How to start?

Purify is available as a package on npm. You can install it with a package manager of your choice:

```
$ npm install purify-ts
```

or

```
$ yarn add purify-ts
```

# Documentation

You can find the documentation on the [official site](https://gigobyte.github.io/purify/).

# Ecosystem

- [purify-ts-extra-codec](https://github.com/airtoxin/purify-ts-extra-codec) - Extra utility codecs
- [chai-purify](https://github.com/dave-inc/chai-purify) - Chai assert helpers
- [purifree](https://github.com/nythrox/purifree) - A fork that allows you to program in a point-free style, and adds a few new capabilities

# Inspired by

- [Elm](https://elm-lang.org/)
- [Arrow - Functional companion to Kotlin's Standard Library](http://arrow-kt.io/)
- [fp-ts - Functional programming in TypeScript](https://github.com/gcanti/fp-ts)
