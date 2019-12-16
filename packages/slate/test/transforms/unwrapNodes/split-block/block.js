/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.unwrapNodes(editor, { match: n => n.a, split: true })
}

export const input = (
  <editor>
    <block a>
      <block>
        <cursor />
        one
      </block>
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      <cursor />
      one
    </block>
  </editor>
)
