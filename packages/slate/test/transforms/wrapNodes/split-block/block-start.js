/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <value>
    <block>
      <anchor />
      wo
      <focus />
      rd
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
        <anchor />
        wo
        <focus />
      </block>
    </block>
    <block>rd</block>
  </value>
)
