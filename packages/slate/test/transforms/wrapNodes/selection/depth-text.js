/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>
      <text>
        <anchor />
        word
        <focus />
      </text>
    </block>
  </editor>
)

export const run = editor => {
  Editor.wrapNodes(editor, <block new />, { match: 'text' })
}

export const output = (
  <editor>
    <block>
      <block new>
        <anchor />
        word
        <focus />
      </block>
    </block>
  </editor>
)
