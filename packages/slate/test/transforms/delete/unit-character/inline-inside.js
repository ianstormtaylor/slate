/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.delete(editor)
}

export const input = (
  <editor>
    <block>
      one
      <inline>
        <cursor />a
      </inline>
      two
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      one
      <inline>
        <cursor />
      </inline>
      two
    </block>
  </editor>
)
