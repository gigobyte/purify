import React from 'react'
import Link from 'gatsby-link'
import styled from 'styled-components'

const Title = styled.h1`
    margin: 0;
`

const Subtitle = styled.h2`
    margin: 0;
`

const NavBar = styled.div`
    background-color: #007acc;
    height: 65px;
    display: flex;
    justify-content: flex-end;
    padding-right: 80px;
`

const NavBarLink = styled.span`
    color: white;
    font-size: 22px;
    align-self: center;
    padding: 0 10px;

    > a {
        text-decoration: none;

        :-webkit-any-link {
            color: white;
        }
    }
`

const Content = styled.div`
    text-align: center;
    background-color: #fbfbfb;
    height: 100%;
`

const IndexPage = () =>
    <div>
        <NavBar>
            <NavBarLink><Link to="adts/Maybe">Docs</Link></NavBarLink>
            <NavBarLink><a href="https://github.com/gigobyte/pure">Github</a></NavBarLink>
        </NavBar>
        <Content>
            <Title>Pure</Title>
            <Subtitle>Functional programming standard library for TypeScript</Subtitle>
        </Content>
    </div>

export default IndexPage
