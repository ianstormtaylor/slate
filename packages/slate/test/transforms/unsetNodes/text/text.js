/** @jsx jsx */

import { Text, Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.setNodes(editor, { key: null }, { match: Text.isText })
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
