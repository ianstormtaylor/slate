/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.move(editor, )
}

export const input = (
  <value>
    <block>
      one <focus />
      two th
      <anchor />
      ree
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      one t<focus />
      wo thr
      <anchor />
      ee
    </block>
  </value>
)
