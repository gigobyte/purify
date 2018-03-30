import * as React from 'react'
import { DataType } from "./data"

 export interface DataTypeProps {
    datatype: DataType
}

const DataType = (props: DataTypeProps) =>
    <div style={{lineHeight: '35px', height: 35, paddingLeft: 10}}>{props.datatype.name}</div>

export default DataType