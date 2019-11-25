/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.wrapNodes(editor, <block new />)
}

export const input = (
  <value>
    <block a>
      <block b>
        <cursor />
        word
      </block>
    </block>
  </value>
)

export const output = (
  <value>
    <block a>
      <block new>
        <block b>
          <cursor />
          word
        </block>
      </block>
    </block>
  </value>
)
