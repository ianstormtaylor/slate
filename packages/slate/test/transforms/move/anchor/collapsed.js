/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.move(editor, { edge: 'anchor' })
}

export const input = (
  <value>
    <block>
      one two t<cursor />
      hree
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      one two t<focus />h<anchor />
      ree
    </block>
  </value>
)
