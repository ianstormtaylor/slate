/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.move(editor, { edge: 'start', distance: 7 })
}

export const input = (
  <value>
    <block>
      one <focus />
      two t<anchor />
      hree
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      one two t<anchor />
      hr
      <focus />
      ee
    </block>
  </value>
)
