import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './App'

document.onreadystatechange = function () {
    if(document.readyState === 'complete') {
        ReactDOM.render(<App />, document.querySelector('.app'))
    }
}