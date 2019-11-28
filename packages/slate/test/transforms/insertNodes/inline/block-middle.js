/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.insertNodes(
    editor,
    <inline void>
      <text />
    </inline>
  )
}

export const input = (
  <editor>
    <block>
      wo
      <cursor />
      rd
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      wo
      <inline void>
        <cursor />
      </inline>
      rd
    </block>
  </editor>
)
