/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.insertFragment(editor, <fragment>fragment</fragment>)
}

export const input = (
  <value>
    <block>
      <cursor />
      <inline>word</inline>
      <text />
    </block>
  </value>
)

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
