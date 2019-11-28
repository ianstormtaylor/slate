/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.unwrapNodes(editor, { match: { key: 'a' } })
}

export const input = (
  <editor>
    <block>
      w<anchor />
      <inline key="a">
        or
        <focus />
      </inline>
      d
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      w<anchor />
      or
      <focus />d
    </block>
  </editor>
)
