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
  readOnly: true,
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
<div data-slate-editor="true">
  <div data-slate-void="true">
    <div>
      <img src="https://example.com/image.png">
    </div>
  </div>
</div>
`.trim()
