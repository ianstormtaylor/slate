/** @jsx h */

import React from 'react'
import h from '../../helpers/h'

function Image(props) {
  return React.createElement('img', {
    src: props.node.data.get('src'),
    ...props.attributes,
  })
}

function renderNode(props) {
  switch (props.node.type) {
    case 'image':
      return Image(props)
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
      <image src="https://example.com/image.png" />
    </document>
  </value>
)

export const output = `
<div data-slate-editor="true" contenteditable="true" role="textbox">
  <div data-slate-void="true">
    <div data-slate-spacer="true" style="height:0;color:transparent;outline:none;position:absolute">
      <span>
        <span>
          <span data-slate-zero-width="z">&#x200B;</span>
        </span>
      </span>
    </div>
    <div contenteditable="false">
      <img src="https://example.com/image.png">
    </div>
  </div>
</div>
`.trim()
