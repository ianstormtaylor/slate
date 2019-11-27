/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.move(editor, { edge: 'focus', reverse: true, distance: 6 })
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
      one <anchor />t<focus />
      wo three
    </block>
  </editor>
)
