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
      <inline>word</inline>
      <cursor />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <text />
      <inline>word</inline>
      fragment
      <cursor />
    </block>
  </value>
)
