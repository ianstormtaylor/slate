/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.move(editor)
}

export const input = (
  <editor>
    <block>
      one <focus />
      two th
      <anchor />
      ree
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      one t<focus />
      wo thr
      <anchor />
      ee
    </block>
  </editor>
)
