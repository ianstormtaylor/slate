/** @jsx h */

import h from '../../../helpers/h'

export const props = {
  placeholder: 'placeholder text',
}

export const value = (
  <value>
    <document>
      <paragraph>
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
        <span>
            <span contenteditable="false" style="pointer-events:none;display:inline-block;width:0;max-width:100%;white-space:nowrap;opacity:0.333">
                placeholder text
            </span>
            <span data-slate-zero-width="n" data-slate-length="0">
                <br>
            </span>
        </span>
      </span>
    </span>
  </div>
</div>
`
  .split('\n')
  .map(l => l.trim())
  .join('')
