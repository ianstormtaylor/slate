/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  marks: {
    bold: 'bold',
  }
}

export const state = (
  <state>
    <document>
      <paragraph>
        one<b>two</b>three
      </paragraph>
    </document>
  </state>
)

export const output = `
<div data-slate-editor="true" contenteditable="true" role="textbox">
  <div style="position:relative;">
    <span>
      <span>one</span>
      <span><span class="bold">two</span></span>
      <span>three</span>
    </span>
  </div>
</div>
`.trim()
