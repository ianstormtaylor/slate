/** @jsx jsx */
import { Transforms, Text } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.unsetNodes(editor, 'a', { match: Text.isText })
}
export const input = (
  <editor>
    <block>
      <text a>
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
