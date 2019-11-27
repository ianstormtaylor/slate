/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.move(editor, { edge: 'anchor', distance: 3 })
}

export const input = (
  <editor>
    <block>
      one <anchor />
      two thr
      <focus />
      ee
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      one two
      <anchor /> thr
      <focus />
      ee
    </block>
  </editor>
)
