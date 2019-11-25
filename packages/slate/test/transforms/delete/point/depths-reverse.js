/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.delete(editor, { reverse: true })
}

export const input = (
  <value>
    <block>Hello</block>
    <block>
      <block>
        <cursor />
        world!
      </block>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      Hello
      <cursor />
      world!
    </block>
  </value>
)
