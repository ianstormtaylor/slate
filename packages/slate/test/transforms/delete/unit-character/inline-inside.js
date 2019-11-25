/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.delete(editor, )
}

export const input = (
  <value>
    <block>
      one
      <inline>
        <cursor />a
      </inline>
      two
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      one
      <inline>
        <cursor />
      </inline>
      two
    </block>
  </value>
)
