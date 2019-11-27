/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.move(editor, { edge: 'focus', distance: 7 })
}

export const input = (
  <editor>
    <block>
      one <focus />
      two <anchor />
      three
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      one two <anchor />
      thr
      <focus />
      ee
    </block>
  </editor>
)
