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
      <inline>word</inline>
      <cursor />
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      <text />
      <inline>word</inline>
      fragment
      <cursor />
    </block>
  </editor>
)
