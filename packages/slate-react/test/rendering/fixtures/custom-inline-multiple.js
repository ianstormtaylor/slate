/** @jsx h */

import React from 'react'
import h from '../../helpers/h'

function Link(props) {
  return React.createElement(
    'a',
    { href: props.node.data.get('href'), ...props.attributes },
    props.children
  )
}

function renderNode(props, editor, next) {
  switch (props.node.type) {
    case 'link':
      return Link(props)
    default:
      return next()
  }
}

export const props = {
  renderNode,
}

export const value = (
  <value>
    <document>
      <paragraph>
        <text />
        <link href="https://google.com">word</link>
        <text />
        <link href="https://google.com">word</link>
        <text />
        <link href="https://google.com">word</link>
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
    <a href="https://google.com">
      <span>
        <span data-slate-leaf="true">
          <span data-slate-content="true">word</span>
        </span>
      </span>
    </a>
    <span>
      <span data-slate-leaf="true">
        <span data-slate-zero-width="z" data-slate-length="0">&#xFEFF;</span>
      </span>
    </span>
    <a href="https://google.com">
      <span>
        <span data-slate-leaf="true">
          <span data-slate-content="true">word</span>
        </span>
      </span>
    </a>
    <span>
      <span data-slate-leaf="true">
        <span data-slate-zero-width="z" data-slate-length="0">&#xFEFF;</span>
      </span>
    </span>
    <a href="https://google.com">
      <span>
        <span data-slate-leaf="true">
          <span data-slate-content="true">word</span>
        </span>
      </span>
    </a>
    <span>
      <span data-slate-leaf="true">
        <span data-slate-zero-width="z" data-slate-length="0">&#xFEFF;</span>
      </span>
    </span>
  </div>
</div>
`.trim()
