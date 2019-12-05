/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.setNodes(editor, { key: true }, { match: 'text' })
}

export const input = (
  <editor>
    <block>
      <anchor />
      word
    </block>
    <block>
      a<focus />
      nother
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      <text key>
        <anchor />
        word
      </text>
    </block>
    <block>
      <text key>
        a<focus />
        nother
      </text>
    </block>
  </editor>
)
