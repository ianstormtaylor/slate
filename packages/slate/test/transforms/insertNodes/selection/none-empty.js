/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = <editor />

export const run = editor => {
  Editor.insertNodes(editor, <block>one</block>)
}

export const output = (
  <editor>
    <block>
      one
      <cursor />
    </block>
  </editor>
)

export const skip = true
