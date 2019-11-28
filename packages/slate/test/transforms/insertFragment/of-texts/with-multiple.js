/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.insertFragment(
    editor,
    <fragment>
      <text>one</text>
      <text>two</text>
    </fragment>
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
      woonetwo
      <cursor />
      rd
    </block>
  </editor>
)
