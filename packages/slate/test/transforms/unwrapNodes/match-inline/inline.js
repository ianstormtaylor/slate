/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.unwrapNodes(editor, { match: { key: 'a' } })
}

export const input = (
  <value>
    <block>
      w<anchor />
      <inline key="a">
        or
        <focus />
      </inline>
      d
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      w<anchor />
      or
      <focus />d
    </block>
  </value>
)
