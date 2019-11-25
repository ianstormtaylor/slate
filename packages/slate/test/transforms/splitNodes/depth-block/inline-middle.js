/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.splitNodes(editor, { match: 'block' })
}

export const input = (
  <value>
    <block>
      <text />
      <inline>
        wo
        <cursor />
        rd
      </inline>
      <text />
    </block>
  </value>
)

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
        rd
      </inline>
      <text />
    </block>
  </value>
)
