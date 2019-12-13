/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block void>
      <cursor />
      one
    </block>
  </editor>
)

export const run = editor => {
  Editor.removeNodes(editor, { at: [0] })
}

export const output = <editor />
