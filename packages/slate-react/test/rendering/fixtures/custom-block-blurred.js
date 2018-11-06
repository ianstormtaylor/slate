/** @jsx h */

import React from 'react'
import h from '../../helpers/h'

function Image(props) {
  return React.createElement('img', {
    className: props.isFocused ? 'focused' : '',
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
      <paragraph>
        <text key="a">
          <anchor />
        </text>
      </paragraph>
      <image src="https://example.com/image.png">
        <text />
      </image>
      <paragraph>
        <text key="b">
          <focus />
        </text>
      </paragraph>
      <image src="https://example.com/image2.png">
        <text />
      </image>
    </document>
    <selection isFocused={false}>
      <anchor key="a" offset={0} />
      <focus key="b" offset={0} />
    </selection>
  </value>
)

export const output = `
<div data-slate-editor="true" contenteditable="true" role="textbox">
   <div style="position:relative">
    <span>
      <span data-slate-leaf="true">
        <span data-slate-zero-width="n" data-slate-length="0">&#xFEFF;<br /></span>
      </span>
    </span>
  </div>
  <div data-slate-void="true">
    <div data-slate-spacer="true" style="height:0;color:transparent;outline:none;position:absolute">
      <span>
        <span data-slate-leaf="true">
          <span data-slate-zero-width="z" data-slate-length="0">&#xFEFF;</span>
        </span>
      </span>
    </div>
    <div contenteditable="false">
      <img class="" src="https://example.com/image.png">
    </div>
  </div>
  <div style="position:relative">
    <span>
      <span data-slate-leaf="true">
        <span data-slate-zero-width="n" data-slate-length="0">&#xFEFF;<br /></span>
      </span>
    </span>
  </div>
  <div data-slate-void="true">
    <div data-slate-spacer="true" style="height:0;color:transparent;outline:none;position:absolute">
      <span>
        <span data-slate-leaf="true">
          <span data-slate-zero-width="z" data-slate-length="0">&#xFEFF;</span>
        </span>
      </span>
    </div>
    <div contenteditable="false">
      <img class="" src="https://example.com/image2.png">
    </div>
  </div>
</div>
`.trim()
