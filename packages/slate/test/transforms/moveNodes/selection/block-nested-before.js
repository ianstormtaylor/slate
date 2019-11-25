/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.moveNodes(editor, { match: ([, p]) => p.length === 2, to: [0] })
}

export const input = (
  <value>
    <block>
      <block>
        <anchor />
        one
      </block>
      <block>
        two
        <focus />
      </block>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <anchor />
      one
    </block>
    <block>
      two
      <focus />
    </block>
    <block>
      <text />
    </block>
  </value>
)
