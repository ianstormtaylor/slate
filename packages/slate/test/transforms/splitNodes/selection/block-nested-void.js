/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.splitNodes(editor)
}

export const input = (
  <editor>
    <block>
      <block void>
        wo
        <anchor />
        rd
      </block>
      <block void>
        an
        <focus />
        other
      </block>
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      <text />
    </block>
  </editor>
)
