/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.unwrapNodes(editor, { match: n => n.a })
}

export const input = (
  <editor>
    <block>
      <text />
      <inline a>
        <anchor />
        one
      </inline>
      two
      <inline a>
        three
        <focus />
      </inline>
      <text />
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      <anchor />
      onetwothree
      <focus />
    </block>
  </editor>
)
