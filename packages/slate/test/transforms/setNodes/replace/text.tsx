/** @jsx jsx */
import { Text, Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.setNodes(
    editor,
    { italic: true },
    { at: [0, 0], match: Text.isText, replace: true }
  )
}
export const input = (
  <editor>
    <block>
      <text bold underline>
        word
      </text>
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <text italic>word</text>
    </block>
  </editor>
)
