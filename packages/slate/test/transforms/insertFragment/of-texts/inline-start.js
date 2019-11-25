/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.insertFragment(editor, <fragment>fragment</fragment>)
}

export const input = (
  <value>
    <block>
      <text />
      <inline>
        <cursor />
        word
      </inline>
      <text />
    </block>
  </value>
)

// TODO: argument to made that fragment should go into the inline
export const output = (
  <value>
    <block>
      fragment
      <cursor />
      <inline>word</inline>
      <text />
    </block>
  </value>
)
