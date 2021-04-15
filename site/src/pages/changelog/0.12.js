import React from 'react'
import styled from 'styled-components'
import Link from 'gatsby-link'
import Layout from '../../components/Layout'
import { HL } from '../../components/HL'

const Title = styled.h1`
  margin-bottom: 0;
`

const Subtitle = styled.div`
  padding-bottom: 30px;
`

const Topic = styled.h2`
  font-weight: normal;
`

const TopicDescription = styled.div`
  padding-right: 15%;

  @media only screen and (max-width: 768px) {
    padding-right: 0;
  }
`

const v012 = (props) => (
  <Layout location={props.location}>
    <Title>Purify v0.12</Title>
    <Subtitle>January 30, 2019</Subtitle>
    <div>
      Not sure what purify is? Check out the{' '}
      <Link to="/getting-started">Getting Started</Link> page. Not sure if you
      want to introduce purify as a dependency to your project? Check out the
      new <Link to="/faq">FAQ</Link> page!
      <br />
      <br />
      Before starting, I want to thank everyone that contributed to the project
      with bug reports, fixes and suggestions ⭐️.
    </div>

    <Topic>MaybeAsync and EitherAsync</Topic>
    <TopicDescription>
      Dealing with asynchronous values was a huge pain point and I've spent a
      lot of time prototyping different solutions.
      <br />
      The general approach to error handling in imperative languages is to throw
      exceptions, which didn't fit into the functional nature of purify.
      <br />
      At the same time, TypeScript's type system made expressing functional
      patterns cumbersome, which didn't leave me with a lot of options.
      <br />
      Despite those challenges I believe the final APIs for{' '}
      <Link to="/adts/MaybeAsync">MaybeAsync</Link> and{' '}
      <Link to="/adts/EitherAsync">EitherAsync</Link> turned out fairly elegant
      and easy to use, please let me know your opinion!
    </TopicDescription>

    <Topic>Complete rewrite</Topic>
    <TopicDescription>
      Put simply, the library had too many issues mainly because of the
      "single-class" implementation of the ADTs, which have since been rewritten
      into plain functions and objects.
      <br />
      This removed a whole class of errors (pun not intended), like a strange
      bug that prevented functions returning a Nothing to be annotated with the
      proper Maybe type (so strange I've filed{' '}
      <a href="https://github.com/Microsoft/TypeScript/issues/29354">
        an issue
      </a>{' '}
      )<br />
      This change is completely under the hood, the public API remains the same.
    </TopicDescription>

    <Topic>Proper fantasy-land support</Topic>
    <TopicDescription>
      All data types provided by purify now include a proper implementation of
      the `constructor` property which points to the type representative.
      <br />
      As a bonus, there is also a Foldable instance for Tuple now!
    </TopicDescription>

    <Topic>
      Typeclasses - scrapped.
      <br />
      Id and Validation - removed.
    </Topic>
    <TopicDescription>
      Old versions of purify exported interfaces which were designed to serve
      the purpose of typeclasses.
      <br />
      There were numerous issues though - typeclasses like Monad could be easily
      represented as object methods, but functions like Applicative's `pure` (or
      `of` in fantasy-land) are meant to go on the type representative, not on
      the object. A Monad instance requires an Applicative instance which was
      unrepresentable in TypeScript's type system without resorting to
      techniques that don't fit into the "interfaces with generics" model.
      There's also the issues with typeclasses like Ord, Setoid and Semigroup
      which don't make much sense in JavaScript where you can compare all
      values.
      <br />
      <br />
      All of these things led to the removal of typeclasses from the library.
      With that went the Id datatype which serves no need anymore.
      <br />
      Since typeclasses were also the justification for having folders in the
      library exports, now the folder structure is flat.
      <br />
      This means that imports like{' '}
      <HL>{`import { Maybe } from 'purify-ts/adts/Maybe`}</HL> are now just{' '}
      <HL>{`import { Maybe } from 'purify-ts/Maybe'`}</HL>.
      <br />
      The Validation module was removed for a completely different reason though
      - the API was just too limiting and ad-hoc, hopefully it will return soon
      in a better, more generic form.
    </TopicDescription>

    <Topic>New Maybe methods</Topic>
    <TopicDescription>
      The original focus for this release was better JS interop and before the
      implementation of MaybeAsync and EitherAsync took most of my time working
      on this project, two new methods were added to the Maybe data type.
      <br />
      <ul>
        <li>
          <HL>Maybe#chainNullable</HL> - The same as Maybe#chain but for
          functions that return a nullable value instead of Maybe.
        </li>
        <li>
          <HL>Maybe#extract</HL> - Now returns an undefined instead of null as
          undefined is used more often to reprent missing values.
        </li>
        <li>
          <HL>Maybe#extractNullable</HL> - The new name of Maybe#extract from
          previous versions of purify
        </li>
      </ul>
    </TopicDescription>

    <Topic>Other changes</Topic>
    <TopicDescription>
      <ul>
        <li>
          There is now a "Guides" section for each data type which will
          hopefully include a lot of useful information in the near future. Stay
          tuned.
        </li>
        <li>
          Docs are now part of the npm package, which means you should be
          getting more information in your editor during autocomplete.
        </li>
        <li>
          Fixed bug where <HL>Just(null)</HL> would be treated as{' '}
          <HL>Nothing</HL>.
        </li>
      </ul>
    </TopicDescription>
  </Layout>
)

export default v012
