/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.move(editor, { edge: 'anchor', reverse: true, distance: 3 })
}

export const input = (
  <value>
    <block>
      one <anchor />
      tw
      <focus />o three
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      o<anchor />
      ne tw
      <focus />o three
    </block>
  </value>
)
