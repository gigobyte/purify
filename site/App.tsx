import * as React from 'react'
import Sidebar from './Sidebar'

const App = () =>
    <div>
        <div style={{display: 'flex'}}>
            <div style={{flex: 1}}>
                <Sidebar />
            </div>
            <div style={{flex: 7}}>
                Content
            </div>
        </div>
    </div>

export default App