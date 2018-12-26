import React from 'react'
import styled from 'styled-components'
import Layout from '../components/layout'

const FAQ = props => (
  <Layout location={props.location}>
    <h1>FAQ</h1>
    <ul>
      <li>
        <h3>Q: Is this library considered finished?</h3>
        Not at all, in fact the library is still in early development.
      </li>
      <li>
        <h3>Q: What are the future goals of the library?</h3>
        The library's overall goals are to continue bringing popular patterns
        from FP languages into TypeScript.<br />
        Here's a preview on what's currently being worked on and when to
        anticipate it:<br />
        <br />
        0.13 - Focus on making async easier (Monad transformers? We'll see.).<br />
        0.14 - Data structures! ZipList, List, IO - there are just some of the
        many future possibilities<br />
        0.15 - TBA (Lens? Parser combinators?)
      </li>
      <li>
        <h3>
          Q: Is this library intended to be part of a ecosystem of likeminded
          libraries or handle additional functionality itself?
        </h3>
        Purify is intented to be a single library with a focus on general
        purpose API.<br />
        Bindings to popular libraries like React, Angular, Express etc. are not
        planned and most likely won't happen.<br />
      </li>
      <li>
        <h3>Q: What is the timeline for the new releases?</h3>
        There are no exact dates for upcoming versions of purify.<br />
        I try to release a new version every couple of months, but there's no
        guarantee for that.
      </li>
      <li>
        <h3>Q: What should future contributors focus on?</h3>
        Pull request for bugfixes or documentation improvements are always
        welcome, but trying to add new methods via a PR most likely won't be
        accepted.<br />
        Sharing use cases or pain points are the fastest way to see something
        implemented in the library and I'll greatly appreciate it.<br />
      </li>
    </ul>
  </Layout>
)

export default FAQ
