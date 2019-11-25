/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <value>
    <block>
      <cursor />
      word
    </block>
  </value>
)

export const run = editor => {
  Editor.wrapNodes(editor, <block new />, { split: true })
}

export const output = (
  <value>
    <block new>
      <block>
        <cursor />
        word
      </block>
    </block>
  </value>
)
