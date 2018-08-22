/** @jsx h */

import React from 'react'
import h from '../../helpers/h'

function decorateNode(block) {
  const text = block.getFirstText()
  return [
    {
      anchor: {
        key: text.key,
        offset: 1,
      },
      focus: {
        key: text.key,
        offset: 2,
      },
      mark: {
        type: 'bold',
      },
    },
  ]
}

function Bold(props) {
  return React.createElement('strong', { ...props.attributes }, props.children)
}

function renderMark(props) {
  switch (props.mark.type) {
    case 'bold':
      return Bold(props)
  }
}

export const props = {
  decorateNode,
  renderMark,
}

export const value = (
  <value>
    <document>
      <paragraph>one</paragraph>
    </document>
  </value>
)

export const output = `
<div data-slate-editor="true" contenteditable="true" role="textbox">
  <div style="position:relative">
    <span>
      <span>o</span>
      <span><strong data-slate-leaf="true">n</strong></span>
      <span>e</span>
    </span>
  </div>
</div>
`.trim()
