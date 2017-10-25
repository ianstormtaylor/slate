/** @jsx h */

import React from 'react'
import h from '../../helpers/h'

export const schema = {
  nodes: {
    emoji: (props) => {
      return (
        React.createElement('img', props.attributes)
      )
    }
  }
}

export const state = (
  <state>
    <document>
      <paragraph>
        <emoji />
      </paragraph>
    </document>
  </state>
)

export const output = `
<div data-slate-editor="true" contenteditable="true" role="textbox">
  <div style="position:relative">
    <span>
      <span>
        <span data-slate-zero-width="true">&#x200A;</span>
      </span>
    </span>
    <span data-slate-void="true" contenteditable="false">
      <span contenteditable="true" data-slate-spacer="true" style="height:0;color:transparent;outline:none">
        <span>
          <span></span>
        </span>
      </span>
      <span draggable="true">
        <img>
      </span>
    </span>
    <span>
      <span>
        <span data-slate-zero-width="true">&#x200A;</span>
      </span>
    </span>
  </div>
</div>
`.trim()
