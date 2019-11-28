/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>
      on
      <anchor />e
    </block>
    <block>
      t<focus />
      wo
    </block>
    <block>three</block>
  </editor>
)

export const run = editor => {
  Editor.removeNodes(editor)
}

export const output = (
  <editor>
    <block>
      <cursor />
      three
    </block>
  </editor>
)
