/** @jsx h */

import h from '../../helpers/h'

export const props = {}

export const value = (
  <value>
    <document>
      <paragraph>Hello, world!</paragraph>
      <paragraph>مرحبا بالعالم</paragraph>
      <paragraph>שלום עולם</paragraph>
    </document>
  </value>
)

export const output = `
<div data-slate-editor="true" contenteditable="true" role="textbox">
  <div style="position:relative">
    <span>
      <span>Hello, world!</span>
    </span>
  </div>
  <div dir="rtl" style="position:relative">
    <span>
      <span>مرحبا بالعالم</span>
    </span>
  </div>
  <div dir="rtl" style="position:relative">
    <span>
      <span>שלום עולם</span>
    </span>
  </div>
</div>
`.trim()
