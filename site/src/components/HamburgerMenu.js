import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  position: absolute;
  right: 19px;
  display: none;

  @media only screen and (max-width: 768px) {
    display: inline-block;
  }
`

const Bar = styled.div`
  width: 35px;
  height: 5px;
  background-color: white;
  margin: 6px 0;
  transition: 0.4s;
`

const Bar1 = styled(Bar)`
  ${(props) =>
    props.changed &&
    `
        transform: rotate(-45deg) translate(-9px, 6px);
    `};
`

const Bar2 = styled(Bar)`
  ${(props) =>
    props.changed &&
    `
        opacity: 0;
    `};
`

const Bar3 = styled(Bar)`
  ${(props) =>
    props.changed &&
    `
    transform: rotate(45deg) translate(-8px, -8px);
    `};
`

const HamburgerMenu = ({ onClick, opened }) => (
  <Container onClick={onClick}>
    <Bar1 changed={opened} />
    <Bar2 changed={opened} />
    <Bar3 changed={opened} />
  </Container>
)

export default HamburgerMenu
