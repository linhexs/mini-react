// src/index
import React from '../react'
class Counter extends React.Component {
    render() {
        return (
            <div>
                <h1>我是</h1>
                <h2>class组件</h2>
            </div>
        )
    }
}

const element = <Counter />

React.render(element, document.getElementById("root"))