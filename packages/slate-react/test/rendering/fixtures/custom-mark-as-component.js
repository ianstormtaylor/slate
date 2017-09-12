/** @jsx h */

import React from 'react'
import h from '../../helpers/h'

class Bold extends React.Component {

  render() {
    return (
      React.createElement('strong', {}, this.props.children)
    )
  }

}

export const schema = {
  marks: {
    bold: Bold,
  }
}

export const state = (
  <state>
    <document>
      <paragraph>
        one<b>two</b>three
      </paragraph>
    </document>
  </state>
)

export const output = `
<div data-slate-editor="true" contenteditable="true" role="textbox">
  <div style="position:relative;">
    <span>
      <span>one</span>
      <span><strong>two</strong></span>
      <span>three</span>
    </span>
  </div>
</div>
`.trim()
