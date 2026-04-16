/** @jsx jsx */
import { Transforms } from 'slate'

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
export const run = (editor) => {
  Transforms.insertText(editor, 'x', { at: { path: [0, 0], offset: 2 } })
}
export const output = (
  <editor>
    <block>
      w<anchor />
      oxr
      <focus />d
    </block>
  </editor>
)
