import * as React from 'react'
import styled from 'styled-components'
import Link from 'gatsby-link'

const Container = styled(Link)`
    display: flex;
    justify-content: space-between;
    height: 45px;
    line-height: 45px;
    padding-left: 20px;
    transition: all .1s ease-in;
    text-decoration: none;
    color: inherit;
    border-bottom: 1px solid #ececec;

    &:hover {
        background-color: #f9f6f6;
        color: #398ae0;
    }
`

const Tag = styled.div`
    background-color: #d6eeff;
    border-radius: 5px;
    color: #2877ad;
    height: 16px;
    line-height: 18px;
    margin-right: 20px;
    font-size: 12px;
    padding: 5px;
    align-self: center;
`

const SidebarLink = ({ name, tag, link }) =>
    <Container to={link}>
        <span>{name}</span>
        {tag && <Tag>{tag}</Tag>}
    </Container>

export default SidebarLink