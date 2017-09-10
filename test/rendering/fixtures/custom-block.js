/** @jsx h */

import React from 'react'
import h from '../../helpers/h'

export const schema = {
  nodes: {
    code: (props) => {
      return (
        React.createElement('pre', props.attributes,
          React.createElement('code', {}, props.children)
        )
      )
    }
  }
}

export const state = (
  <state>
    <document>
      <code>
        word
      </code>
    </document>
  </state>
)

export const output = `
<div data-slate-editor="true" contenteditable="true" role="textbox">
  <pre>
    <code>
      <span>
        <span>word</span>
      </span>
    </code>
  </pre>
</div>
`.trim()
