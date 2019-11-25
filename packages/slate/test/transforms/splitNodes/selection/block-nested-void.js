/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.splitNodes(editor)
}

export const input = (
  <value>
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
  </value>
)

export const output = (
  <value>
    <block>
      <text />
    </block>
  </value>
)
