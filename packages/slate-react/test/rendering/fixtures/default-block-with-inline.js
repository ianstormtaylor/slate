/** @jsx h */

import h from '../../helpers/h'

export const schema = {}

export const state = (
  <state>
    <document>
      <paragraph>
        <link>
          word
        </link>
      </paragraph>
    </document>
  </state>
)

export const output = `
<div data-slate-editor="true" contenteditable="true" role="textbox">
  <div style="position:relative;">
    <span>
      <span>
        <span data-slate-zero-width="true">&#x200A;</span>
      </span>
    </span>
    <span style="position:relative;">
      <span>
        <span>word</span>
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
