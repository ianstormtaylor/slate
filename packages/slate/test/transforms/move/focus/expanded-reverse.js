/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.move(editor, { edge: 'focus', reverse: true })
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
      one <anchor />t<focus />
      wo three
    </block>
  </value>
)
