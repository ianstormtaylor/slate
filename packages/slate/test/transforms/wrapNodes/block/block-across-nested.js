/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.wrapNodes(editor, <block a />)
}

export const input = (
  <value>
    <block>
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

export const output = (
  <value>
    <block>
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
    </block>
  </value>
)
