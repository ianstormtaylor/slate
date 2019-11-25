/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <value>
    <block>
      <text />
      <inline>
        wo
        <anchor />
        rd
      </inline>
      <text />
    </block>
    <block>
      <text />
      <inline>
        an
        <focus />
        other
      </inline>
      <text />
    </block>
  </value>
)

export const run = editor => {
  Editor.splitNodes(editor)
}

export const output = (
  <value>
    <block>
      <text />
      <inline>wo</inline>
      <text />
    </block>
    <block>
      <text />
      <inline>
        <cursor />
        other
      </inline>
      <text />
    </block>
  </value>
)
