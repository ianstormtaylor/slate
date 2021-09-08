/** @jsx jsx */
import { Transforms, Text } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.setNodes(
    editor,
    { someKey: true },
    { match: Text.isText, split: true }
  )
}
export const input = (
  <editor>
    <block>
      w<anchor />
      or
      <focus />d
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <text>w</text>
      <text someKey>
        <anchor />
        or
        <focus />
      </text>
      <text>d</text>
    </block>
  </editor>
)
