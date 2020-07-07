/** @jsx jsx */
import { Transforms, Text } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.unsetNodes(editor, 'key', { match: Text.isText })
}
export const input = (
  <editor>
    <block>
      <text key>
        <cursor />
        word
      </text>
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <cursor />
      word
    </block>
  </editor>
)
