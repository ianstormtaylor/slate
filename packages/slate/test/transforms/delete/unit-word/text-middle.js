/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.delete(editor, { unit: 'word' })
}

export const input = (
  <value>
    <block>
      o<cursor />
      ne two three
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      o<cursor /> two three
    </block>
  </value>
)
