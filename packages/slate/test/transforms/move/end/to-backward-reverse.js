/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.move(editor, { edge: 'end', reverse: true, distance: 6 })
}

export const input = (
  <value>
    <block>
      one <anchor />
      two
      <focus /> three
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      o<focus />
      ne <anchor />
      two three
    </block>
  </value>
)
