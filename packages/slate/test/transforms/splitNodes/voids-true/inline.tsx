/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.splitNodes(editor, { at: [0, 1, 1], voids: true })
}
export const input = (
  <editor>
    <block>
      <text />
      <inline void>
        <text>one</text>
        <text>two</text>
      </inline>
      <text />
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <text />
      <inline void>
        <text>one</text>
      </inline>
      <text />
      <inline void>
        <text>two</text>
      </inline>
      <text />
    </block>
  </editor>
)
