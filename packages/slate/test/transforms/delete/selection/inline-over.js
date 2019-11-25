/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.delete(editor, )
}

export const input = (
  <value>
    <block>
      o<anchor />
      ne<inline>two</inline>thre
      <focus />e
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      o<cursor />e
    </block>
  </value>
)
