/** @jsx h */

import React from 'react'
import h from '../../helpers/h'

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
  renderMark,
}

export const value = (
  <value>
    <document>
      <paragraph>
        one<b>two</b>three
      </paragraph>
    </document>
  </value>
)

export const output = `
<div data-slate-editor="true" contenteditable="true" role="textbox">
  <div style="position:relative">
    <span>
      <span data-slate-leaf="true">
        <span data-slate-content="true">one</span>
      </span>
      <span data-slate-leaf="true">
        <strong data-slate-mark="true">
          <span data-slate-content="true">two</span>
        </strong>
      </span>
      <span data-slate-leaf="true">
        <span data-slate-content="true">three</span>
      </span>
    </span>
  </div>
</div>
`.trim()
