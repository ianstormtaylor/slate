/** @jsx h */

import React from 'react'
import h from '../../helpers/h'

function Emoji(props) {
  return React.createElement('img', props.attributes)
}

function renderNode(props) {
  switch (props.node.type) {
    case 'emoji':
      return Emoji(props)
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
        <emoji />
      </paragraph>
    </document>
  </value>
)

export const output = `
<div data-slate-editor="true">
  <div style="position:relative">
    <span>
      <span>
        <span data-slate-zero-width="z">&#x200B;</span>
      </span>
    </span>
    <span data-slate-void="true">
      <span>
        <img>
      </span>
    </span>
    <span>
      <span>
        <span data-slate-zero-width="n">&#x200B;</span>
      </span>
    </span>
  </div>
</div>
`.trim()
