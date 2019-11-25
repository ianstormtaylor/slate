/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.move(editor, { edge: 'focus', reverse: true, distance: 10 })
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
      o<focus />
      ne <anchor />
      two three
    </block>
  </value>
)
