/** @jsx h */

import React from 'react'
import h from '../../helpers/h'

function Emoji(props) {
  return React.createElement('img', props.attributes)
}

function renderNode(props, editor, next) {
  switch (props.node.type) {
    case 'emoji':
      return Emoji(props)
    default:
      return next()
  }
}

export const props = {
  renderNode,
  schema: {
    inlines: {
      emoji: {
        isVoid: true,
      },
    },
  },
}

export const value = (
  <value>
    <document>
      <paragraph>
        <text />
        <emoji>
          <text />
        </emoji>
        <text />
      </paragraph>
    </document>
  </value>
)

export const output = `
<div data-slate-editor="true" contenteditable="true" role="textbox">
  <div style="position:relative">
    <span>
      <span data-slate-leaf="true">
        <span data-slate-zero-width="z" data-slate-length="0">&#xFEFF;</span>
      </span>
    </span>
    <span data-slate-void="true" contenteditable="false">
      <span data-slate-spacer="true" style="height:0;color:transparent;outline:none;position:absolute">
        <span>
          <span data-slate-leaf="true">
            <span data-slate-zero-width="z" data-slate-length="0">&#xFEFF;</span>
          </span>
        </span>
      </span>
      <span contenteditable="false">
        <img>
      </span>
    </span>
    <span>
      <span data-slate-leaf="true">
        <span data-slate-zero-width="n" data-slate-length="0">&#xFEFF;<br /></span>
      </span>
    </span>
  </div>
</div>
`.trim()
