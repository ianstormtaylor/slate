/** @jsx h */

import React from 'react'
import h from '../../helpers/h'

function Emoji(props) {
  return (
    React.createElement('img', props.attributes)
  )
}

function renderNode(props) {
  switch (props.node.type) {
    case 'emoji': return Emoji(props)
  }
}

export const props = {
  readOnly: true,
  renderNode,
}

export const state = (
  <state>
    <document>
      <paragraph>
        <emoji />
      </paragraph>
    </document>
  </state>
)

export const output = `
<div data-slate-editor="true">
  <div style="position:relative">
    <span>
      <span>
        <span data-slate-zero-width="true">&#x200A;</span>
      </span>
    </span>
    <span data-slate-void="true">
      <span>
        <img>
      </span>
    </span>
    <span>
      <span>
        <span data-slate-zero-width="true">&#x200A;</span>
      </span>
    </span>
  </div>
</div>
`.trim()
