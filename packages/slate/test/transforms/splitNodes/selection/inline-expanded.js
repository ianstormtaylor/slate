/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.splitNodes(editor)
}

export const input = (
  <value>
    <block>
      <text />
      <inline>
        w<anchor />
        or
        <focus />d
      </inline>
      <text />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <text />
      <inline>w</inline>
      <text />
    </block>
    <block>
      <text />
      <inline>
        <cursor />d
      </inline>
      <text />
    </block>
  </value>
)
