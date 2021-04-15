import React from 'react'
import styled from 'styled-components'
import Meta from '../components/Meta'

import Sidebar from '../components/Sidebar'
import './Layout.css'

const Container = styled.div`
  min-height: 100vh;
  display: flex;

  @media only screen and (max-width: 768px) {
    flex-direction: column;
  }
`

const SidebarContainer = styled.div`
  flex: 1;
  min-height: 100%;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  z-index: 1;
  min-width: 200px;
`

const ContentContainer = styled.div`
  flex: 7;
  background-color: #fbfbfb;
  padding: 20px;
`

const LayoutWithSidebar = (children) => (
  <Container>
    <Meta />
    <SidebarContainer>
      <Sidebar />
    </SidebarContainer>
    <ContentContainer>{children}</ContentContainer>
  </Container>
)

const Layout = ({ children, location }) =>
  location.pathname === '/' || location.pathname === '/purify/'
    ? children
    : LayoutWithSidebar(children)

export default Layout
