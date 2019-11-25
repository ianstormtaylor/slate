/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <value>
    <block>
      wo
      <anchor />
      rd
      <focus />
    </block>
  </value>
)

export const run = editor => {
  Editor.wrapNodes(editor, <block new />, { split: true })
}

export const output = (
  <value>
    <block>wo</block>
    <block new>
      <block>
        <anchor />
        rd
        <focus />
      </block>
    </block>
  </value>
)
