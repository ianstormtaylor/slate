/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.insertFragment(editor, <fragment>fragment</fragment>)
}

export const input = (
  <editor>
    <block>
      <text />
      <inline>
        <cursor />
        word
      </inline>
      <text />
    </block>
  </editor>
)

// TODO: argument to made that fragment should go into the inline
export const output = (
  <editor>
    <block>
      fragment
      <cursor />
      <inline>word</inline>
      <text />
    </block>
  </editor>
)
