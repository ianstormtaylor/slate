/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.delete(editor, { unit: 'character', reverse: true })
}

export const input = (
  <value>
    <block>
      <text />
      <inline>
        wor📛
        <cursor />d
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
        wor
        <cursor />d
      </inline>
      <text />
    </block>
  </value>
)
