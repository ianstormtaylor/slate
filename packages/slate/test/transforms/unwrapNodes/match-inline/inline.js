/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.unwrapNodes(editor, { match: n => n.a })
}

export const input = (
  <editor>
    <block>
      w<anchor />
      <inline a>
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
