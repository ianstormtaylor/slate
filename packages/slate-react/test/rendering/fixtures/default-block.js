/** @jsx h */

import h from '../../helpers/h'

export const props = {}

export const value = (
  <value>
    <document>
      <paragraph>word</paragraph>
    </document>
  </value>
)

export const output = `
<div data-slate-editor="true" contenteditable="true" role="textbox">
  <div style="position:relative">
    <span>
      <span data-slate-leaf="true">
        <span data-slate-content="true">word</span>
      </span>
    </span>
  </div>
</div>
`.trim()
