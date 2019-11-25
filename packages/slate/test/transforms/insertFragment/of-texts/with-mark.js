/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.insertFragment(
    editor,
    <fragment>
      <mark>fragment</mark>
    </fragment>
  )
}

export const input = (
  <value>
    <block>
      wo
      <cursor />
      rd
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      wo
      <mark>fragment</mark>
      <cursor />
      rd
    </block>
  </value>
)
