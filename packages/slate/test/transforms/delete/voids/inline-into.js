/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.delete(editor)
}

export const input = (
  <editor>
    <block>
      <anchor />
      one
      <inline>
        t<focus />
        wo
      </inline>
      <text />
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      <text />
      <inline>
        <cursor />
        wo
      </inline>
      <text />
    </block>
  </editor>
)
