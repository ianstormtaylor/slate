/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <value>
    <block>one</block>
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

export const run = editor => {
  Editor.wrapNodes(editor, <block a />)
}

export const output = (
  <value>
    <block>one</block>
    <block a>
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
