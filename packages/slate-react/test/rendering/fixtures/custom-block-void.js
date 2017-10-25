/** @jsx h */

import React from 'react'
import h from '../../helpers/h'

export const schema = {
  nodes: {
    image: (props) => {
      return (
        React.createElement('img', { src: props.node.data.get('src'), ...props.attributes })
      )
    }
  }
}

export const state = (
  <state>
    <document>
      <image src="https://example.com/image.png" />
    </document>
  </state>
)

export const output = `
<div data-slate-editor="true" contenteditable="true" role="textbox">
  <div data-slate-void="true" draggable="true" contenteditable="false">
    <div contenteditable="true" data-slate-spacer="true" style="height:0;color:transparent;outline:none">
      <span>
        <span></span>
      </span>
    </div>
    <div>
      <img src="https://example.com/image.png">
    </div>
  </div>
</div>
`.trim()
