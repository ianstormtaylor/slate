/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.insertFragment(
    editor,
    <fragment>
      <mark a>one</mark>
      <mark b>two</mark>
      <mark c>three</mark>
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
      wo
      <mark a>one</mark>
      <mark b>two</mark>
      <mark c>three</mark>
      <cursor />
      rd
    </block>
  </editor>
)
