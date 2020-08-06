/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.delete(editor)
}
export const input = (
  <editor>
    <block>
      <text>
        <cursor />
      </text>
      <inline void>
        <text />
      </inline>
      <text />
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <text>
        <cursor />
      </text>
    </block>
  </editor>
)
