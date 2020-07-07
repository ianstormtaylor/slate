/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.splitNodes(editor, { at: { path: [0, 1, 0], offset: 2 } })
}
export const input = (
  <editor>
    <block>
      <text />
      <inline void>
        <text>word</text>
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
        <text>word</text>
      </inline>
      <text />
    </block>
    <block>
      <text />
    </block>
  </editor>
)
