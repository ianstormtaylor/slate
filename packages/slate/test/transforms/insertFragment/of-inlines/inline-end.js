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
      <text />
      <inline>
        word
        <cursor />
      </inline>
      <text />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <text />
      <inline>word</inline>
      <text />
      <inline>
        fragment
        <cursor />
      </inline>
      <text />
    </block>
  </value>
)
