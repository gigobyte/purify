import React from 'react'
import Link from 'gatsby-link'
import styled, { css } from 'styled-components'
import Layout from '../components/Layout'

const versionStyle = css`
  margin-right: 15px;
  background: #d6eeff;
  padding: 0 5px;
  border-radius: 6px;
  text-decoration: none;
  color: #2877ad;
  width: 42px;
  text-align: center;
  height: 25px;
`

const Version = styled(Link)`
  display: block;
  ${versionStyle};
`

const VersionStatic = styled.div`
  ${versionStyle};
  color: black;
`

const Description = styled.div`
  flex: 1;
`

const Date = styled.div`
  flex: 1;

  @media only screen and (max-width: 768px) {
    text-align: right;
  }
`

const VersionContainer = styled.div`
  display: flex;
  width: 85%;
  padding-bottom: 10px;

  @media only screen and (max-width: 768px) {
    width: 100%;
  }
`

const Changelog = (props) => (
  <Layout location={props.location}>
    <div>
      <h1>Choose version:</h1>
      <VersionContainer>
        <VersionStatic>1.2.2</VersionStatic>
        <Description>
          Check out the release on{' '}
          <a href="https://github.com/gigobyte/purify/releases/tag/v1.2.2">
            GitHub
          </a>
        </Description>
        <Date>June 2022</Date>
      </VersionContainer>
      <VersionContainer>
        <VersionStatic>1.2.0</VersionStatic>
        <Description>
          Check out the release on{' '}
          <a href="https://github.com/gigobyte/purify/releases/tag/v1.2.0">
            GitHub
          </a>
        </Description>
        <Date>March 2022</Date>
      </VersionContainer>
      <VersionContainer>
        <VersionStatic>1.1.0</VersionStatic>
        <Description>
          Check out the release on{' '}
          <a href="https://github.com/gigobyte/purify/releases/tag/v1.1.0">
            GitHub
          </a>
        </Description>
        <Date>October 2021</Date>
      </VersionContainer>
      <VersionContainer>
        <VersionStatic>1.0.0</VersionStatic>
        <Description>
          Check out the release on{' '}
          <a href="https://github.com/gigobyte/purify/releases/tag/v1.0.0">
            GitHub
          </a>
        </Description>
        <Date>July 2021</Date>
      </VersionContainer>
      <VersionContainer>
        <VersionStatic>0.16.3</VersionStatic>
        <Description>
          Check out the release on{' '}
          <a href="https://github.com/gigobyte/purify/releases/tag/v0.16.3">
            GitHub
          </a>
        </Description>
        <Date>May 2021</Date>
      </VersionContainer>
      <VersionContainer>
        <VersionStatic>0.16.2</VersionStatic>
        <Description>
          Check out the release on{' '}
          <a href="https://github.com/gigobyte/purify/releases/tag/v0.16.2">
            GitHub
          </a>
        </Description>
        <Date>April 2021</Date>
      </VersionContainer>
      <VersionContainer>
        <Version to="/changelog/0.16">0.16</Version>
        <Description>Version 1.0.0 preparation</Description>
        <Date>November 2020</Date>
      </VersionContainer>
      <VersionContainer>
        <Version to="/changelog/0.15">0.15</Version>
        <Description>Polished Maybe/EitherAsync API</Description>
        <Date>April 2020</Date>
      </VersionContainer>
      <VersionContainer>
        <VersionStatic>0.14.1</VersionStatic>
        <Description>
          Check out the release on{' '}
          <a href="https://github.com/gigobyte/purify/releases/tag/v0.14.1">
            GitHub
          </a>
        </Description>
        <Date>January 2020</Date>
      </VersionContainer>
      <VersionContainer>
        <Version to="/changelog/0.14">0.14</Version>
        <Description>JSON codecs and a new build</Description>
        <Date>December 2019</Date>
      </VersionContainer>
      <VersionContainer>
        <VersionStatic>0.13.2</VersionStatic>
        <Description>
          Check out the release on{' '}
          <a href="https://github.com/gigobyte/purify/releases/tag/v0.13.2">
            GitHub
          </a>
        </Description>
        <Date>September 2019</Date>
      </VersionContainer>
      <VersionContainer>
        <VersionStatic>0.13.1</VersionStatic>
        <Description>
          Check out the release on{' '}
          <a href="https://github.com/gigobyte/purify/releases/tag/v0.13.1">
            GitHub
          </a>
        </Description>
        <Date>August 2019</Date>
      </VersionContainer>
      <VersionContainer>
        <Version to="/changelog/0.13">0.13</Version>
        <Description>Mostly quality of life utilities</Description>
        <Date>August 2019</Date>
      </VersionContainer>
      <VersionContainer>
        <Version to="/changelog/0.12">0.12</Version>
        <Description>
          Complete rewrite, Async for all and more fantasy-land support
        </Description>
        <Date>January 2019</Date>
      </VersionContainer>
      <VersionContainer>
        <Version to="/changelog/0.11">0.11</Version>
        <Description>
          NonEmptyList, Tuple destructuring, Improved pretty printing and more
        </Description>
        <Date>September 2018</Date>
      </VersionContainer>
      <VersionContainer>
        <VersionStatic>0.10</VersionStatic>
        <Description>Initial release</Description>
        <Date>July 2018</Date>
      </VersionContainer>
    </div>
  </Layout>
)

export default Changelog
