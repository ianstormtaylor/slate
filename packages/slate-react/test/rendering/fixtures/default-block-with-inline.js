/** @jsx h */

import h from '../../helpers/h'

export const props = {}

export const value = (
  <value>
    <document>
      <paragraph>
        <link>word</link>
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
    <span style="position:relative">
      <span>
        <span>word</span>
      </span>
    </span>
    <span>
      <span>
        <span data-slate-zero-width="z">&#x200B;</span>
      </span>
    </span>
  </div>
</div>
`.trim()
