/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.unwrapNodes(editor, { match: { key: 'a' } })
}

export const input = (
  <value>
    <block key="a">
      <block>
        <cursor />
        word
      </block>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <cursor />
      word
    </block>
  </value>
)
