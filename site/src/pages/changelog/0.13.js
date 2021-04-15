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

const v013 = (props) => (
  <Layout location={props.location}>
    <Title>Purify v0.13</Title>
    <Subtitle>August 15, 2019</Subtitle>
    <div>
      Not sure what purify is? Check out the{' '}
      <Link to="/getting-started">Getting Started</Link> page. Not sure if you
      want to introduce purify as a dependency to your project? Check out the{' '}
      <Link to="/faq">FAQ</Link> page!
      <br />
      This release is a small one, it includes mostly utilities and typesafe
      versions of already existing JavaScript functions.
    </div>

    <Topic>New Function module</Topic>
    <TopicDescription>
      Purify now has a general utility module called Function, it includes
      things like the identity function. As of this release it's quite small but
      hopefully it grows as TypeScript starts supporting more and more
      functional utilities like compose and pipe,{' '}
      <Link to="/utils/Function">check it out</Link>!<br />
    </TopicDescription>

    <Topic>More List functions</Topic>
    <TopicDescription>
      The main goal of the List module is to provide typesafe alternatives of
      the built-in Array.prototype methods.
      <br />
      With that in mind, List now includes <HL>find</HL>, <HL>findIndex</HL> and
      also immutable <HL>List.sort</HL>.
    </TopicDescription>

    <Topic>Faster implementation</Topic>
    <TopicDescription>
      Purify went throught another redesign in this release, the new class-based
      solution is what the original rewrite of purify in{' '}
      <Link to="/changelog/0.12">0.12</Link> should've been.
      <br />
      Like last time, this redesign does not affect the public API of the
      library.
    </TopicDescription>
  </Layout>
)

export default v013
