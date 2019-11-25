/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.delete(editor, { unit: 'character', reverse: true })
}

export const input = (
  <value>
    <block>
      one
      <inline>
        a<cursor />
      </inline>
      three
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      one
      <inline>
        <cursor />
      </inline>
      three
    </block>
  </value>
)
