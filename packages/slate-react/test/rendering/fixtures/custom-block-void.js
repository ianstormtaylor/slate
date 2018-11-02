/** @jsx h */

import React from 'react'
import h from '../../helpers/h'

function Image(props) {
  return React.createElement('img', {
    src: props.node.data.get('src'),
    ...props.attributes,
  })
}

function renderNode(props, editor, next) {
  switch (props.node.type) {
    case 'image':
      return Image(props)
    default:
      return next()
  }
}

export const props = {
  renderNode,
  schema: {
    blocks: {
      image: {
        isVoid: true,
      },
    },
  },
}

export const value = (
  <value>
    <document>
      <image src="https://example.com/image.png">
        <text />
      </image>
    </document>
  </value>
)

export const output = `
<div data-slate-editor="true" contenteditable="true" role="textbox">
  <div data-slate-void="true">
    <div data-slate-spacer="true" style="height:0;color:transparent;outline:none;position:absolute">
      <span>
        <span data-slate-leaf="true">
          <span data-slate-zero-width="z">&#xFEFF;</span>
        </span>
      </span>
    </div>
    <div contenteditable="false">
      <img src="https://example.com/image.png">
    </div>
  </div>
</div>
`.trim()
