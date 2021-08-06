/** @jsx jsx */
import { Editor, Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.splitNodes(editor, {
    at: { path: [0, 0], offset: 2 },
  })
}
export const input = (
  <editor>
    <block>
      <text bold>word</text>
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <text bold>wo</text>
    </block>
    <block>
      <text bold>rd</text>
    </block>
  </editor>
)
