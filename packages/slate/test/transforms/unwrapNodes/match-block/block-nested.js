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
        <block>
          <cursor />
          word
        </block>
      </block>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <block>
        <cursor />
        word
      </block>
    </block>
  </value>
)
