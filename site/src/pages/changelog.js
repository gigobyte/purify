import React from 'react'
import Link from 'gatsby-link'
import styled, { css } from 'styled-components'
import Layout from '../components/layout'

const versionStyle = css`
  margin-right: 15px;
  background: #d6eeff;
  padding: 0 5px;
  border-radius: 6px;
  text-decoration: none;
  color: #2877ad;
`

const Version = styled(Link)`
  display: block;
  height: 25px;
  ${versionStyle};
`

const VersionStatic = styled.div`
  ${versionStyle} color: black;
`

const Description = styled.div`
  flex: 1;
`

const Date = styled.div`
  flex: 1;
`

const VersionContainer = styled.div`
  display: flex;
  width: 85%;
  padding-bottom: 10px;
`

const Changelog = props => (
  <Layout location={props.location}>
    <div>
      <h1>Choose version:</h1>
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
