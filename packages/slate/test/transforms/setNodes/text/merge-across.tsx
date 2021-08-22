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
      <text>
        One
        <anchor />
      </text>
      <text someKey>Two</text>
      <text>
        <focus />
        Three
      </text>
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <text>
        One
        <anchor />
      </text>
      <text someKey>
        Two
        <focus />
      </text>
      <text>Three</text>
    </block>
  </editor>
)
