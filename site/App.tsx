import * as React from 'react'
import styled from 'styled-components'
import Sidebar from './Sidebar'

const Container = styled.div`
    height: 100%;
    display: flex;
`

const SidebarContainer = styled.div`
    flex: 1;
    height: 100%;
    box-shadow: 0 3px 6px rgba(0,0,0,0.1);
    z-index: 1;
`

const ContentContainer = styled.div`
    flex: 7;
    background-color: #fbfbfb;
`

const App = () =>
    <Container>
        <SidebarContainer>
            <Sidebar />
        </SidebarContainer>
        <ContentContainer>
            Content
        </ContentContainer>
    </Container>

export default App