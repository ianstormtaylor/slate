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
<div data-slate-editor="true" contenteditable="true" role="textbox">
  <div style="position:relative">
    <span>
      <span>
        <span data-slate-zero-width="z">&#x200B;</span>
      </span>
    </span>
    <span data-slate-void="true" contenteditable="false">
      <span data-slate-spacer="true" style="height:0;color:transparent;outline:none;position:absolute">
        <span>
          <span>
            <span data-slate-zero-width="z">&#x200B;</span>
          </span>
        </span>
      </span>
      <span contenteditable="false">
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
