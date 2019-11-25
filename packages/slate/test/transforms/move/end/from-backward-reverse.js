/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.move(editor, { edge: 'end', reverse: true, distance: 7 })
}

export const input = (
  <value>
    <block>
      one <focus />
      two <anchor />
      three
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      o<anchor />
      ne <focus />
      two three
    </block>
  </value>
)
