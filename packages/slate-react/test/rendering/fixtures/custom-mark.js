/** @jsx h */

import React from 'react'
import h from '../../helpers/h'

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
      <span>one</span>
      <span><strong data-slate-leaf="true">two</strong></span>
      <span>three</span>
    </span>
  </div>
</div>
`.trim()
