import * as React from 'react'
import DataType from './DataType'
import { data } from './data'

const headerStyle =
    { backgroundColor: '#007acc'
    , color: 'white'
    , display: 'flex' as 'flex'
    , justifyContent: 'center' as 'center'
    , height: 60
    , flexDirection: 'column' as 'column'
    , alignItems: 'center' as 'center'
    , borderBottom: '1px solid #e0e0e0'
    }

const Sidebar = () =>
    <div>
        <div style={headerStyle}>
            <span style={{fontSize: 20}}>Pure</span>
            <span>v0.0.1</span>
        </div>
        <div style={{borderRight: '1px solid #e0e0e0'}}>
            {data.datatypes.map(datatype => (
                <div key={datatype.name}>
                    <DataType datatype={datatype} />
                </div>
            ))}
        </div>
    </div>

export default Sidebar