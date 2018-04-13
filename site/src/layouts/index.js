import React from 'react'
import styled from 'styled-components'
import Helmet from 'react-helmet'

import Sidebar from '../components/Sidebar'
import './index.css'

const Container = styled.div`
    min-height: 100vh;
    display: flex;
`

const SidebarContainer = styled.div`
    flex: 1;
    min-height: 100%;
    box-shadow: 0 3px 6px rgba(0,0,0,0.1);
    z-index: 1;
    min-width: 232px;
    width: 232px;
`

const ContentContainer = styled.div`
    flex: 7;
    background-color: #fbfbfb;
    padding: 20px;
`

const Layout = ({ children }) =>
    <Container>
        <SidebarContainer>
            <Sidebar />
        </SidebarContainer>
        <ContentContainer>
            {children()}
        </ContentContainer>
    </Container>

export default Layout