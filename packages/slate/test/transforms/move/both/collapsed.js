/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.move(editor, )
}

export const input = (
  <value>
    <block>
      one <cursor />
      two three
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      one t<cursor />
      wo three
    </block>
  </value>
)
