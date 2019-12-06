/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block void>
      <text>
        on
        <anchor />e
      </text>
    </block>
    <block void>
      <text>
        t<focus />
        wo
      </text>
    </block>
  </editor>
)

export const run = editor => {
  Editor.delete(editor, { voids: true })
}

export const output = (
  <editor>
    <block void>
      on
      <cursor />
      wo
    </block>
  </editor>
)
