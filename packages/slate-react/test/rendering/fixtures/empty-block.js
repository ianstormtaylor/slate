/** @jsx h */

import h from '../../helpers/h'

export const props = {}

export const value = (
  <value>
    <document>
      <paragraph />
    </document>
  </value>
)

export const output = `
<div data-slate-editor="true" contenteditable="true" role="textbox">
  <div style="position:relative">
    <span>
      <span>
        <span data-slate-zero-width="n">\u200B</span>
      </span>
    </span>
  </div>
</div>
`.trim()
