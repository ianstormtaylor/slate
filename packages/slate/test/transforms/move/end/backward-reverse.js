/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.move(editor, { edge: 'end', reverse: true })
}

export const input = (
  <editor>
    <block>
      one <focus />
      two t<anchor />
      hree
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      one <focus />
      two <anchor />
      three
    </block>
  </editor>
)
