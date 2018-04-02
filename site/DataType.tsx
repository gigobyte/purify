import * as React from 'react'
import styled from 'styled-components'
import { DataType } from "./data"

export interface DataTypeProps {
    datatype: DataType
}

const Container = styled.a`
    display: block;
    height: 45px;
    line-height: 45px;
    padding-left: 20px;
    transition: all .1s ease-in;
    text-decoration: none;
    color: inherit;

    &:hover {
        background-color: #f9f6f6;
        color: #398ae0;
    }
`

const DataType = ({ datatype }: DataTypeProps) =>
    <Container href="/test">{datatype.name}</Container>

export default DataType