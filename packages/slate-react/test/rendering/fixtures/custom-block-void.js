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
  <div data-slate-void="true" contenteditable="false">
    <div contenteditable="true" data-slate-spacer="true" style="height:0;color:transparent;outline:none">
      <span>
        <span>
          <span data-slate-zero-width="z">&#x200B;</span>
        </span>
      </span>
    </div>
    <div draggable="true">
      <img src="https://example.com/image.png">
    </div>
  </div>
</div>
`.trim()
