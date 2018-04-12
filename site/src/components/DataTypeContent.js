import React from 'react'
import styled from 'styled-components'
import data from '../data'
import DataTypeMethod from './DataTypeMethod'

const Container = styled.div`
`

const Title = styled.h1`
    font-weight: inherit;
`

const Description = styled.div`
    padding-right: 15%;
    font-size: 1.05em;
`

const TopicHeader = styled.h2`
    font-weight: inherit;
    margin-bottom: 0;
`

const DataTypeContent = adt => () =>
    <Container>
        <Title>{adt.name}</Title>
        <Description>{adt.description}</Description>
        <TopicHeader>Construction</TopicHeader>
        {adt.constructors.map(DataTypeMethod)}
        <TopicHeader>Static methods</TopicHeader>
        {adt.staticMethods.map(DataTypeMethod)}
    </Container>

export default DataTypeContent