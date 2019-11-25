/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.moveNodes(editor, { match: ([, p]) => p.length === 2, to: [1] })
}

export const input = (
  <value>
    <block>
      <block>one</block>
      <block>
        <anchor />
        two
      </block>
      <block>
        three
        <focus />
      </block>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <block>one</block>
    </block>
    <block>
      <anchor />
      two
    </block>
    <block>
      three
      <focus />
    </block>
  </value>
)
