/** @jsx jsx */
import { Transforms, Text } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.setNodes(editor, { someKey: true }, { match: Text.isText })
}
export const input = (
  <editor>
    <block>
      <anchor />
      word
    </block>
    <block>
      a<focus />
      nother
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <text someKey>
        <anchor />
        word
      </text>
    </block>
    <block>
      <text someKey>
        a<focus />
        nother
      </text>
    </block>
  </editor>
)
