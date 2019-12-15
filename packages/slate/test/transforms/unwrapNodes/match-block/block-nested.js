/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.unwrapNodes(editor, { match: n => n.a })
}

export const input = (
  <editor>
    <block a>
      <block>
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
      <block>
        <cursor />
        word
      </block>
    </block>
  </editor>
)
