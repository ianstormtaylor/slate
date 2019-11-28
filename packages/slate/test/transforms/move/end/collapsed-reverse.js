/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.move(editor, { edge: 'end', reverse: true })
}

export const input = (
  <editor>
    <block>
      one two t<cursor />
      hree
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      one two <focus />t<anchor />
      hree
    </block>
  </editor>
)
