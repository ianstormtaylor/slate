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

export const props = {
  readOnly: true,
}

export const state = (
  <state>
    <document>
      <image src="https://example.com/image.png" />
    </document>
  </state>
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
