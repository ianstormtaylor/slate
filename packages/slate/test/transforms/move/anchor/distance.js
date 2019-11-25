/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.move(editor, { edge: 'anchor', distance: 3 })
}

export const input = (
  <value>
    <block>
      one <anchor />
      two thr
      <focus />
      ee
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      one two
      <anchor /> thr
      <focus />
      ee
    </block>
  </value>
)
