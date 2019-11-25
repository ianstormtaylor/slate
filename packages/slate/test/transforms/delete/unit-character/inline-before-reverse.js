/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.delete(editor, { unit: 'character', reverse: true })
}

export const input = (
  <value>
    <block>
      a<cursor />
      <inline>two</inline>
      three
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <cursor />
      <inline>two</inline>
      three
    </block>
  </value>
)
