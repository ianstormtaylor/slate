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
  readOnly: true,
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
        <emoji>
          <text />
        </emoji>
      </paragraph>
    </document>
  </value>
)

export const output = `
<div data-slate-editor="true">
  <div style="position:relative">
    <span>
      <span data-slate-leaf="true">
        <span data-slate-zero-width="z" data-slate-length="0">&#xFEFF;</span>
      </span>
    </span>
    <span data-slate-void="true">
      <span>
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
