/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <value>
    <block>
      w<anchor />
      or
      <focus />d
    </block>
  </value>
)

export const run = editor => {
  Editor.wrapNodes(editor, <block new />, { split: true })
}

export const output = (
  <value>
    <block>w</block>
    <block new>
      <block>
        <anchor />
        or
        <focus />
      </block>
    </block>
    <block>d</block>
  </value>
)
