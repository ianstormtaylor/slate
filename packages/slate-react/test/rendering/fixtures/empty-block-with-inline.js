/** @jsx h */

import h from '../../helpers/h'

export const schema = {}

export const state = (
  <state>
    <document>
      <paragraph>
        <link />
      </paragraph>
    </document>
  </state>
)

export const output = `
<div data-slate-editor="true" contenteditable="true" role="textbox">
  <div style="position:relative;">
    <span>
      <span><br></span>
    </span>
  </div>
</div>
`.trim()
