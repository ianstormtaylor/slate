/** @jsx jsx */
import { Transforms, Text } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.setNodes(
    editor,
    { someKey: null },
    { match: Text.isText, split: true }
  )
}
export const input = (
  <editor>
    <block>
      <text someKey>
        w<anchor />
        or
        <focus />d
      </text>
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <text someKey>w</text>
      <text>
        <anchor />
        or
        <focus />
      </text>
      <text someKey>d</text>
    </block>
  </editor>
)
