/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.wrapNodes(
    editor,
    <block a>
      <block b>
        <text />
      </block>
    </block>
  )
}

export const input = (
  <value>
    <block>
      wo
      <anchor />
      rd
    </block>
    <block>
      an
      <focus />
      other
    </block>
  </value>
)

export const output = (
  <value>
    <block a>
      <block>
        wo
        <anchor />
        rd
      </block>
      <block>
        an
        <focus />
        other
      </block>
    </block>
  </value>
)
