/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.unwrapNodes(editor, { match: { a: true }, mode: 'all' })
}

export const input = (
  <editor>
    <block a>
      <block a>
        <block>
          <cursor />
          word
        </block>
      </block>
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      <cursor />
      word
    </block>
  </editor>
)
