import * as React from 'react'
import styled from 'styled-components'
import Link from 'gatsby-link'

const Container = styled(Link)`
  display: flex;
  justify-content: space-between;
  height: 45px;
  line-height: 45px;
  padding-left: 20px;
  transition: all 0.1s ease-in;
  text-decoration: none;
  color: inherit;
  border-bottom: 1px solid #ececec;

  &:hover {
    background-color: #f9f6f6;
    color: #398ae0;
  }
`

const Tag = styled.div`
  background-color: ${(props) => props.palette.bgColor};
  border-radius: 5px;
  color: ${(props) => props.palette.color};
  height: 16px;
  line-height: 18px;
  margin-right: 20px;
  font-size: 12px;
  padding: 5px;
  min-width: 21px;
  text-align: center;
  align-self: center;
`

const colorMap = {
  ADT: { color: '#2877ad', bgColor: '#d6eeff' },
  Util: { color: '#0a9e1b', bgColor: '#d3f9d8' },
  Typeclass: { color: 'white', bgColor: '#af87e6' }
}

const SidebarLink = ({ name, tag, link }) => (
  <Container to={link}>
    <span>{name}</span>
    {tag && <Tag palette={colorMap[tag]}>{tag}</Tag>}
  </Container>
)

export default SidebarLink
