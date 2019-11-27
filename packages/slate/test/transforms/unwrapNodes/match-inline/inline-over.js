/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.unwrapNodes(editor, { match: { key: 'a' } })
}

export const input = (
  <editor>
    <block>
      w<anchor />o<inline key="a">rd</inline>
      <text />
    </block>
    <block>
      <text />
      <inline key="a">an</inline>
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
