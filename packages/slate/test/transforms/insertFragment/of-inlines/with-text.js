/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.insertFragment(
    editor,
    <fragment>
      one
      <inline>two</inline>
      three
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
      woone
      <inline>two</inline>
      three
      <cursor />
      rd
    </block>
  </value>
)
