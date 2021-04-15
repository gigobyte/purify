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

const v016 = (props) => (
  <Layout location={props.location}>
    <Title>Purify v0.16</Title>
    <Subtitle>November 7, 2020</Subtitle>
    <div>
      Not sure what purify is? Check out the{' '}
      <Link to="/getting-started">Getting Started</Link> page. Also check out
      the <Link to="/faq">FAQ</Link> page!
      <br />
      <br />
      This is a huge release with a lot of changes and I'm really exited! 0.16
      will be the final 0.x version before the official 1.0.0 release, you can
      think of 0.16 as a Version 1 RC.
      <Topic>
        <span style={{ color: '#d22626' }}>Breaking:</span> Codec
      </Topic>
      <ul>
        <li>
          Renamed <HL>GetInterface</HL> to <HL>GetType</HL>.
        </li>
        <li>
          Running <HL>decode</HL> will not populate a field inside an object
          it's <HL>undefined</HL>, instead it will just leave it out.
        </li>
      </ul>
      <Topic>
        <span style={{ color: '#d22626' }}>Breaking:</span> Either and Maybe
      </Topic>
      <ul>
        <li>
          Removed internal <HL>__value</HL> property inside both Either and
          Maybe. It was not supposed to be used anyway so there shouldn't be any
          breakages.
        </li>
        <li>
          Running <HL>Either#unsafeDecode</HL> used to throw a generic error if
          the value inside was Left. That error is still there, but if the value
          is an instance of <HL>Error</HL>, it will throw the value instead.
          This makes debugging and logging easier.
        </li>
      </ul>
      <Topic>
        <span style={{ color: '#d22626' }}>Breaking:</span> EitherAsync and
        MaybeAsync
      </Topic>
      <ul>
        <li>
          Removed <HL>liftPromise</HL> from both EitherAsync and MaybeAsync.
          With the addition of <HL>PromiseLike</HL> support this utility is just
          an alias for the normal constructors, making it redundant.
        </li>
        <li>
          Since <HL>PromiseLike</HL> is now supported in both modules you should
          be using the special constructors <HL>liftEither</HL>,{' '}
          <HL>liftMaybe</HL> and <HL>fromPromise</HL> way less now.
          <br />
          Because of that they are now static methods (e.g. to use run{' '}
          <HL>EitherAsync.liftEither</HL> or <HL>MaybeAsync.fromPromise</HL>)
        </li>
      </ul>
      <Topic>
        <span style={{ color: '#0a9e1b' }}>Additions:</span> EitherAsync and
        MaybeAsync (there are a lot)
      </Topic>
      <ul>
        <li>
          Both EitherAsync and MaybeAsync now extend and support the{' '}
          <HL>PromiseLike</HL> interface. This means you can await them and you
          can interchange *Async and PromiseLike in most utility methods. <br />
          This is a huge win for productivity and reducing boilerplate, I hope
          we get to see cool examples of how this helps people.
        </li>
        <li>
          Both EitherAsync and MaybeAsync are now fantasy-land compatible.
        </li>
        <li>
          Added static methods to EitherAsync - <HL>lefts</HL>, <HL>rights</HL>,{' '}
          <HL>sequence</HL>, <HL>liftEither</HL>, <HL>fromPromise</HL>.
        </li>
        <li>
          Added instance methods to EitherAsync - <HL>swap</HL>, <HL>ifLeft</HL>
          , <HL>ifRight</HL>, <HL>bimap</HL>, <HL>join</HL>, <HL>ap</HL>,{' '}
          <HL>alt</HL>, <HL>extend</HL>, <HL>leftOrDefault</HL>,{' '}
          <HL>orDefault</HL>.
        </li>
        <li>
          Added static methods to MaybeAsync - <HL>catMaybes</HL>,{' '}
          <HL>liftMaybe</HL>, <HL>fromPromise</HL>.
        </li>
        <li>
          Added instance methods to EitherAsync - <HL>ifJust</HL>,{' '}
          <HL>ifNothing</HL>, <HL>join</HL>, <HL>ap</HL>, <HL>alt</HL>,{' '}
          <HL>extend</HL>, <HL>filter</HL>, <HL>orDefault</HL>.
        </li>
        <li>
          EitherAsync now has a looser type definition for{' '}
          <HL>EitherAsync#chain</HL> as it will merge the two errors together in
          an union type instead of showing a compiler error if the error types
          are different.
        </li>
      </ul>
      <Topic>
        <span style={{ color: '#0a9e1b' }}>Additions:</span> Either and Maybe
      </Topic>
      <ul>
        <li>
          Added static method to Maybe - <HL>isMaybe.</HL>
        </li>
        <li>
          Added static methods to Either - <HL>isEither</HL> and{' '}
          <HL>sequence.</HL>
        </li>
        <li>
          Either now has a looser type definition for <HL>Either#chain</HL> as
          it will merge the two errors together in an union type instead of
          showing a compiler error if the error types are different .
        </li>
        <li>
          Either now has a runtime tag so that values are easier to debug
          (previously when you logged an Either you couldn't tell if it's Left
          or Right).
        </li>
      </ul>
      <Topic>
        <span style={{ color: '#0a9e1b' }}>Additions:</span> Codec
      </Topic>
      <ul>
        <li>
          Added new codecs and combinators: <HL>nullable</HL>,{' '}
          <HL>enumeration</HL>, <HL>intersect</HL>.
        </li>
        <li>
          Added a new property of each codec - <HL>schema</HL>, it returns a
          JSON Schema V6 of that codec so that you can reuse validation in
          non-JavaScript environments (tools, other languages etc.).
        </li>
        <li>
          Added a new utility type, <HL>FromType</HL>, that helps with creating
          codecs based on existing types.
        </li>
        <li>
          Added a new utility function - <HL>parseError</HL>, that takes an
          error string generated after running <HL>decode</HL> on a value and
          returns a meta object
          <br />
          which you can use to create all kinds of stuff - from custom error
          reporters to recovery mechanisms.
        </li>
        <li>
          If you use the <HL>maybe</HL> codec combinator inside a{' '}
          <HL>Codec.interface</HL> it will handle optional properties just like{' '}
          <HL>optional</HL>.
        </li>
      </ul>
      <Topic>
        <span style={{ color: '#0a9e1b' }}>Additions:</span> Other
      </Topic>
      <ul>
        <li>
          Added two new methods to Tuple - <HL>some</HL> and <HL>every</HL> that
          act like the Array methods of the same name.
        </li>
        <li>
          Added a new utility function to NonEmptyList - <HL>tail</HL>.
        </li>
      </ul>
      <Topic>
        <span style={{ color: '#efb022' }}>Bugfixes:</span> Codec
      </Topic>
      <ul>
        <li>
          Fixed a critical bug in <HL>oneOf</HL> that caused encoding to fail.
        </li>
      </ul>
    </div>
  </Layout>
)

export default v016
