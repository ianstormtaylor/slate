/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.move(editor, { edge: 'focus', distance: 4 })
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
      one <anchor />
      two th
      <focus />
      ree
    </block>
  </value>
)
