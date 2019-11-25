/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.unwrapNodes(editor, { match: { key: 'a' }, split: true })
}

export const input = (
  <value>
    <block key="a">
      <block>
        <cursor />
        one
      </block>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <cursor />
      one
    </block>
  </value>
)
