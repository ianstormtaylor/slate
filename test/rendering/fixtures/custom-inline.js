/** @jsx h */

import React from 'react'
import h from '../../helpers/h'

export const schema = {
  nodes: {
    link: (props) => {
      return (
        React.createElement('a', { href: props.node.data.get('href'), ...props.attributes }, props.children)
      )
    }
  }
}

export const state = (
  <state>
    <document>
      <paragraph>
        <link href="https://google.com">
          word
        </link>
      </paragraph>
    </document>
  </state>
)

export const output = `
<div data-slate-editor="true" contenteditable="true" role="textbox">
  <div style="position:relative;">
    <span>
      <span>
        <span data-slate-zero-width="true">&#x200A;</span>
      </span>
    </span>
    <a href="https://google.com">
      <span>
        <span>word</span>
      </span>
    </a>
    <span>
      <span>
        <span data-slate-zero-width="true">&#x200A;</span>
      </span>
    </span>
  </div>
</div>
`.trim()
