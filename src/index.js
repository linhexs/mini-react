// src/index
import React from '../react'

function Counter() {
    const [state, setState] = React.useState(1)
    return (
        <div>
            <h1 >
                Count: {state}
            </h1>
            <button onClick={() => setState(state => state + 1)}>+1</button>
        </div>
    )
}
const element = <Counter />

React.render(element, document.getElementById("root"))