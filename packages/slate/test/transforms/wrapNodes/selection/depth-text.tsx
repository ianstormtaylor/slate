/** @jsx jsx */
import { Transforms, Text } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>
      <text>
        <anchor />
        word
        <focus />
      </text>
    </block>
  </editor>
)
export const run = editor => {
  Transforms.wrapNodes(editor, <block new />, { match: Text.isText })
}
export const output = (
  <editor>
    <block>
      <block new>
        <anchor />
        word
        <focus />
      </block>
    </block>
  </editor>
)
