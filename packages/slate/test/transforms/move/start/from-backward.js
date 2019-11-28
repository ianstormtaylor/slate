/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.move(editor, { edge: 'start', distance: 7 })
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
      one two t<anchor />
      hr
      <focus />
      ee
    </block>
  </editor>
)
