/** @jsx jsx */
import { Transforms, Text } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.setNodes(editor, { a: true }, { match: Text.isText })
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
      <text a>
        <anchor />
        word
      </text>
    </block>
    <block>
      <text a>
        a<focus />
        nother
      </text>
    </block>
  </editor>
)
