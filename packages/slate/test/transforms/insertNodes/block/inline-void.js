/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.insertNodes(
    editor,
    <block>
      <text />
    </block>
  )
}

export const input = (
  <value>
    <block>
      <text />
      <inline void>
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
      <inline void>
        <text />
      </inline>
      <text />
    </block>
    <block>
      <cursor />
    </block>
    <block>
      <text />
    </block>
  </value>
)

export const skip = true
