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

function renderMark(props, editor, next) {
  switch (props.mark.type) {
    case 'bold':
      return Bold(props)
    default:
      return next()
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
      <span data-slate-leaf="true">
        <span data-slate-content="true">o</span>
      </span>
      <span data-slate-leaf="true">
        <strong data-slate-mark="true">
          <span data-slate-content="true">n</span>
        </strong>
      </span>
      <span data-slate-leaf="true">
        <span data-slate-content="true">e</span>
      </span>
    </span>
  </div>
</div>
`.trim()
