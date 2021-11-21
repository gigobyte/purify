import React from 'react'
import Layout from '../components/Layout'

const FAQ = (props) => (
  <Layout location={props.location}>
    <h1>FAQ</h1>
    <ul>
      <li>
        <h3>Q: What are the future goals of the library?</h3>
        The library's overall goals are to continue bringing popular patterns
        from FP languages into TypeScript.
      </li>
      <li>
        <h3>Q: How are new features decided and planned?</h3>
        Most of the development stems from dogfooding the library in personal
        projects. <br />
        User feedback is also extremely important - check out the question at
        the bottom to see why.
      </li>
      <li>
        <h3>
          Q: Is this library intended to be used on the front-end or the
          back-end?
        </h3>
        Purify is intended to be used both on the front-end and the back-end.
        <br />
        Everything from the build config to the API choices and features
        included is made with this in mind.
      </li>
      <li>
        <h3>
          Q: Is this library intended to be part of an ecosystem of likeminded
          libraries or handle additional functionality itself?
        </h3>
        Purify is intented to be a single library with a focus on general
        purpose API.
        <br />
        Official bindings to popular libraries like React, Angular, Express etc.
        are not planned and most likely won't happen.
        <br />
      </li>
      <li>
        <h3>Q: What is the timeline for the new releases?</h3>
        There are no exact dates for upcoming versions of Purify.
        <br />
        Now that the library is post-v1 you can expect a more irregular release
        schedule.
      </li>
      <li>
        <h3>Q: Should I expect breaking changes?</h3>
        Situations in which you can definitely expect breaking changes are:{' '}
        <br />
        There is a new TypeScript release that allows for more type safety
        <br />
        There is a new TypeScript release that makes expressing certain
        constructs (like HKTs) possible
        <br />
        ECMAScript proposals that allow for a more elegant API (like the
        pipeline operator) reach stage 3<br /> <br />
        TL;DR - Breaking changes will be rare, but if the language evolves in a
        way that makes FP code easier to write then there will be changes for
        sure.
      </li>
      <li>
        <h3>Q: What should future contributors focus on?</h3>
        Pull request for bugfixes or documentation improvements are always
        welcome, but trying to add new methods via a PR most likely won't be
        accepted.
        <br />
        Sharing use cases or pain points are the fastest way to see something
        implemented in the library and I'll greatly appreciate it.
        <br />
      </li>
    </ul>
  </Layout>
)

export default FAQ
