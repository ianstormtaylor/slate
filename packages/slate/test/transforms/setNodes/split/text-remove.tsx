/** @jsx jsx */
import { Transforms, Text } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.setNodes(editor, { a: null }, { match: Text.isText, split: true })
}
export const input = (
  <editor>
    <block>
      <text a>
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
      <text a>w</text>
      <text>
        <anchor />
        or
        <focus />
      </text>
      <text a>d</text>
    </block>
  </editor>
)
