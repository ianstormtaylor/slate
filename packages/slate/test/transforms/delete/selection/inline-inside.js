/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.delete(editor, )
}

export const input = (
  <value>
    <block>
      <text />
      <inline>
        wo
        <anchor />r<focus />d
      </inline>
      <text />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <text />
      <inline>
        wo
        <cursor />d
      </inline>
      <text />
    </block>
  </value>
)
