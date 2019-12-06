/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.delete(editor)
}

export const input = (
  <editor>
    <block>one</block>
    <block>
      t<anchor />
      wo<inline>three</inline>fou
      <focus />r
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>one</block>
    <block>
      t<cursor />r
    </block>
  </editor>
)
