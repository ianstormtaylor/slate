/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.move(editor, )
}

export const input = (
  <value>
    <block>
      one <anchor />
      two th
      <focus />
      ree
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      one t<anchor />
      wo thr
      <focus />
      ee
    </block>
  </value>
)
