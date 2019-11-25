/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.move(editor, { edge: 'end', distance: 3 })
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
      one <anchor />
      two thre
      <focus />e
    </block>
  </value>
)
