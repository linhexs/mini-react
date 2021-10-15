// src/index
import React from '../react';

const container = document.getElementById("root")

const updateValue = e => {
    rerender(e.target.value)
}

const rerender = value => {
    const element = (
        <div>
            <input onInput={updateValue} value={value} />
            <h2>Hello {value}</h2>
        </div>
    )
    React.render(element, container)
}

rerender("World")

