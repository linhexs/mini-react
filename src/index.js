// src/index
import React from '../react';

const element = (
  <div id="foo">
    <a>bar</a>
    <b />
  </div>
)

React.render(element, document.getElementById('root'))
