import React from 'react'
import Link from 'gatsby-link'
import styled from 'styled-components'
import SidebarLink from './SidebarLink'
import HamburgerMenu from './HamburgerMenu'
import data from '../data'

const Container = styled.div`
  min-height: 100%;
`

const Header = styled.div`
  background-color: #3b74d7;
  color: white;
  display: flex;
  justify-content: center;
  height: 60px;
  flex-direction: column;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
`

const HeaderTitle = styled(Link)`
  font-size: 20px;
  color: white;
  text-decoration: none;
`

const HeaderTitleVersion = styled.span`
  margin-top: -7px;
  font-size: 15px;
`

const Nav = styled.div`
  height: 100%;
  transition: 0.2s;

  @media only screen and (max-width: 768px) {
    opacity: ${(props) => (props.shown ? '1' : '0')};
    height: ${(props) => (props.shown ? '100%' : '0')};
    visibility: ${(props) => (props.shown ? 'visible' : 'hidden')};
  }
`

class Sidebar extends React.Component {
  state = { isMenuShown: false }

  toggleMenu = () => {
    this.setState({ isMenuShown: !this.state.isMenuShown })
  }

  render() {
    return (
      <Container>
        <Header>
          <HeaderTitle to="/">Purify</HeaderTitle>
          <HeaderTitleVersion>v1.2.2</HeaderTitleVersion>
          <HamburgerMenu
            onClick={this.toggleMenu}
            opened={this.state.isMenuShown}
          />
        </Header>
        <Nav shown={this.state.isMenuShown}>
          <SidebarLink name="Home" link="/" />
          <SidebarLink name="Getting started" link="/getting-started" />
          <SidebarLink name="FAQ" link="/faq" />
          <SidebarLink name="Changelog" link="/changelog" />
          {data.datatypes.map((datatype) => (
            <div key={datatype.name} onClick={this.toggleMenu}>
              <SidebarLink
                name={datatype.name}
                link={`/adts/${datatype.name}`}
                tag="ADT"
              />
            </div>
          ))}
          {data.utils.map((util) => (
            <div key={util.name} onClick={this.toggleMenu}>
              <SidebarLink
                name={util.name}
                link={`/utils/${util.name}`}
                tag="Util"
              />
            </div>
          ))}
        </Nav>
      </Container>
    )
  }
}

export default Sidebar
