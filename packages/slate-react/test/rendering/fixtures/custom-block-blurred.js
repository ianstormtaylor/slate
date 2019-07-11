/** @jsx h */

import React from 'react'
import h from '../../helpers/h'

function renderBlock(props, editor, next) {
  switch (props.node.type) {
    case 'image':
      return React.createElement('img', {
        className: props.isFocused ? 'focused' : '',
        src: props.node.data.get('src'),
        ...props.attributes,
      })
    default:
      return next()
  }
}

export const props = {
  renderBlock,
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
      <paragraph>
        <text key="a">
          <anchor isFocused={false} />
        </text>
      </paragraph>
      <image src="https://example.com/image.png">
        <text />
      </image>
      <paragraph>
        <text key="b">
          <focus isFocused={false} />
        </text>
      </paragraph>
      <image src="https://example.com/image2.png">
        <text />
      </image>
    </document>
  </value>
)

export const output = `
<div contenteditable="true">
   <div>
    <span>
      <span>
        <span>&#xFEFF;<br /></span>
      </span>
    </span>
  </div>
  <div>
    <div>
      <span>
        <span>
          <span>&#xFEFF;</span>
        </span>
      </span>
    </div>
    <div contenteditable="false">
      <img class="" src="https://example.com/image.png">
    </div>
  </div>
  <div style="position:relative">
    <span>
      <span>
        <span>&#xFEFF;<br /></span>
      </span>
    </span>
  </div>
  <div>
    <div>
      <span>
        <span>
          <span>&#xFEFF;</span>
        </span>
      </span>
    </div>
    <div contenteditable="false">
      <img class="" src="https://example.com/image2.png">
    </div>
  </div>
</div>
`.trim()
