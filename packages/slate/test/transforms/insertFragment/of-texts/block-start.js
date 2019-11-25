/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.insertFragment(editor, <fragment>fragment</fragment>)
}

export const input = (
  <value>
    <block>
      <cursor />
      word
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      fragment
      <cursor />
      word
    </block>
  </value>
)
