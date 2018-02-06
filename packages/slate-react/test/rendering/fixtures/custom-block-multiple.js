/** @jsx h */

import React from 'react'
import h from '../../helpers/h'

function Code(props) {
  return React.createElement(
    'pre',
    props.attributes,
    React.createElement('code', {}, props.children)
  )
}

function renderNode(props) {
  switch (props.node.type) {
    case 'code':
      return Code(props)
  }
}

export const props = {
  renderNode,
}

export const value = (
  <value>
    <document>
      <code>word</code>
      <code>word</code>
      <code>word</code>
    </document>
  </value>
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
  <pre>
    <code>
      <span>
        <span>word</span>
      </span>
    </code>
  </pre>
  <pre>
    <code>
      <span>
        <span>word</span>
      </span>
    </code>
  </pre>
</div>
`.trim()
