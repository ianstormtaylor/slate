/** @jsx jsx */

import { jsx } from '../../..'

jsx

import { Transforms } from 'slate'

export const run = (editor) => {
  Transforms.unwrapNodes(editor, { match: (n) => n.a })
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
