/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.move(editor, { reverse: true, unit: 'word' })
}

export const input = (
  <value>
    <block>
      one tw
      <cursor />o three
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      one <cursor />
      two three
    </block>
  </value>
)
