/** @jsx jsx */
import { Transforms, Text } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.setNodes(editor, { key: true }, { match: Text.isText })
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
      <text key={true}>
        <anchor />
        word
      </text>
    </block>
    <block>
      <text key={true}>
        a<focus />
        nother
      </text>
    </block>
  </editor>
)
