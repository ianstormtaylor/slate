/** @jsx jsx */
import { Transforms, Text } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.setNodes(
    editor,
    { key: null },
    { match: Text.isText, split: true }
  )
}
export const input = (
  <editor>
    <block>
      <text key={true}>
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
      <text key={true}>w</text>
      <text>
        <anchor />
        or
        <focus />
      </text>
      <text key={true}>d</text>
    </block>
  </editor>
)
