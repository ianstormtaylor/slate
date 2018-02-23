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

function renderNode(props) {
  switch (props.node.type) {
    case 'link':
      return Link(props)
  }
}

export const props = {
  renderNode,
}

export const value = (
  <value>
    <document>
      <paragraph>
        <link href="https://google.com">word</link>
        <link href="https://google.com">word</link>
        <link href="https://google.com">word</link>
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
    <a href="https://google.com">
      <span>
        <span>word</span>
      </span>
    </a>
    <span>
      <span>
        <span data-slate-zero-width="z">&#x200B;</span>
      </span>
    </span>
    <a href="https://google.com">
      <span>
        <span>word</span>
      </span>
    </a>
    <span>
      <span>
        <span data-slate-zero-width="z">&#x200B;</span>
      </span>
    </span>
    <a href="https://google.com">
      <span>
        <span>word</span>
      </span>
    </a>
    <span>
      <span>
        <span data-slate-zero-width="z">&#x200B;</span>
      </span>
    </span>
  </div>
</div>
`.trim()
