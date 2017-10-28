/** @jsx h */

import h from '../../helpers/h'

export const props = {}

export const value = (
  <value>
    <document>
      <paragraph>
        <link />
      </paragraph>
    </document>
  </value>
)

export const output = `
<div data-slate-editor="true" contenteditable="true" role="textbox">
  <div style="position:relative">
    <span contenteditable="false" style="pointer-events:none;display:inline-block;width:0;max-width:100%;white-space:nowrap;opacity:0.333"></span>
    <span>
      <span>
        <span data-slate-empty-block="true">\n</span>
      </span>
    </span>
  </div>
</div>
`.trim()
