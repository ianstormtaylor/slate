/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.move(editor, { edge: 'start', distance: 3 })
}

export const input = (
  <value>
    <block>
      one <anchor />
      two t<focus />
      hree
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      one two
      <anchor /> t<focus />
      hree
    </block>
  </value>
)
