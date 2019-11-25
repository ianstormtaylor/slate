/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.splitNodes(editor, { match: 'block', always: true })
}

export const input = (
  <value>
    <block>word</block>
    <block>
      <cursor />
      another
    </block>
  </value>
)

export const output = (
  <value>
    <block>word</block>
    <block>
      <text />
    </block>
    <block>
      <cursor />
      another
    </block>
  </value>
)
