/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.move(editor, { reverse: true })
}

export const input = (
  <value>
    <block>
      one <anchor />
      two th
      <focus />
      ree
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      one
      <anchor /> two t<focus />
      hree
    </block>
  </value>
)
