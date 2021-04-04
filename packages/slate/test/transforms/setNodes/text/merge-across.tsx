/** @jsx jsx */
import { Transforms, Text } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.setNodes(
    editor,
    { key: true },
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
      <text key>Two</text>
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
      <text key>
        Two
        <focus />
      </text>
      <text>Three</text>
    </block>
  </editor>
)
