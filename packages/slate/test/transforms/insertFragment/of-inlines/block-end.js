/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.insertFragment(
    editor,
    <fragment>
      <inline>fragment</inline>
    </fragment>
  )
}

export const input = (
  <value>
    <block>
      word
      <cursor />
    </block>
  </value>
)

// TODO: this cursor placement seems off
export const output = (
  <value>
    <block>
      word
      <inline>
        fragment
        <cursor />
      </inline>
      <text />
    </block>
  </value>
)
