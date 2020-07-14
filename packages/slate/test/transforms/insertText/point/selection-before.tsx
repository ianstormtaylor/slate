/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>
      <text>
        w<anchor />
        or
        <focus />d
      </text>
    </block>
  </editor>
)
export const run = editor => {
  Transforms.insertText(editor, 'x', { at: { path: [0, 0], offset: 0 } })
}
export const output = (
  <editor>
    <block>
      xw
      <anchor />
      or
      <focus />d
    </block>
  </editor>
)
