// src/index
import React from '../react'

function App(props){
    return <h1>H1,{props.name}!</h1>
}

const element = (<App name='foo'></App>)

React.render(element, document.getElementById("root"))


