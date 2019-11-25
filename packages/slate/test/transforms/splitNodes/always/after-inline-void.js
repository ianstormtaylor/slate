/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.splitNodes(editor, { match: 'block', always: true })
}

export const input = (
  <value>
    <block>
      one
      <inline void>
        <text />
      </inline>
      <cursor />
      two
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      one
      <inline void>
        <text />
      </inline>
      <text />
    </block>
    <block>
      <cursor />
      two
    </block>
  </value>
)
