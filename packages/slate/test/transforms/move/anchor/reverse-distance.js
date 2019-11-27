/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.move(editor, { edge: 'anchor', reverse: true, distance: 3 })
}

export const input = (
  <editor>
    <block>
      one <anchor />
      tw
      <focus />o three
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      o<anchor />
      ne tw
      <focus />o three
    </block>
  </editor>
)
