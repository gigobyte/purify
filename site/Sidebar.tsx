import * as React from 'react'
import styled from 'styled-components'
import DataType from './DataType'
import { data } from './data'

const Container = styled.div`
    height: 100%;
`

const Header = styled.div`
    background-color: #007acc;
    color: white;
    display: flex;
    justify-content: center;
    height: 60px;
    flex-direction: column;
    align-items: center;
    border-bottom: 1px solid #e0e0e0;
`

const HeaderTitle = styled.span`
    font-size: 20px;
`

const Nav = styled.div`
    border-right: 1px solid #e0e0e0;
    height: 100%;
`

const Sidebar = () =>
    <Container>
        <Header>
            <HeaderTitle>Pure</HeaderTitle>
            <span>v0.0.1</span>
        </Header>
        <Nav>
            {data.datatypes.map(datatype => (
                <DataType key={datatype.name} datatype={datatype} />
            ))}
        </Nav>
    </Container>

export default Sidebar