/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.move(editor, { reverse: true })
}

export const input = (
  <value>
    <block>
      one <focus />
      two th
      <anchor />
      ree
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      one
      <focus /> two t<anchor />
      hree
    </block>
  </value>
)
