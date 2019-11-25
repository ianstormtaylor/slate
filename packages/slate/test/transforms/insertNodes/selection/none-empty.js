/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = <value />

export const run = editor => {
  Editor.insertNodes(editor, <block>one</block>)
}

export const output = (
  <value>
    <block>
      one
      <cursor />
    </block>
  </value>
)

export const skip = true
