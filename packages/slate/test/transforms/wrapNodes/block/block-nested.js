/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.wrapNodes(editor, <block new />)
}

export const input = (
  <editor>
    <block a>
      <block b>
        <cursor />
        word
      </block>
    </block>
  </editor>
)

export const output = (
  <editor>
    <block a>
      <block new>
        <block b>
          <cursor />
          word
        </block>
      </block>
    </block>
  </editor>
)
