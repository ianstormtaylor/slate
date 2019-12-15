/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.unwrapNodes(editor, { match: n => n.a })
}

export const input = (
  <editor>
    <block>
      w<anchor />o<inline a>rd</inline>
      <text />
    </block>
    <block>
      <text />
      <inline a>an</inline>
      ot
      <focus />
      her
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      w<anchor />
      ord
    </block>
    <block>
      anot
      <focus />
      her
    </block>
  </editor>
)
