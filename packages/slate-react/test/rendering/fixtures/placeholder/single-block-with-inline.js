/** @jsx h */

import h from '../../../helpers/h'

export const props = {
  placeholder: 'placeholder text',
}

export const value = (
  <value>
    <document>
      <paragraph>
        <inline type="link">
          <text />
        </inline>
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
                <span data-slate-zero-width="z" data-slate-length="0"></span>
            </span>
        </span>
        <span style="position:relative">
            <span>
                <span data-slate-leaf="true">
                    <span data-slate-zero-width="z" data-slate-length="0"></span>
                </span>
            </span>
        </span>
        <span>
            <span data-slate-leaf="true">
                <span data-slate-zero-width="n" data-slate-length="0">
                    <br>
                </span>
            </span>
        </span>
    </div>
</div>
`
  .split('\n')
  .map(l => l.trim())
  .join('')
