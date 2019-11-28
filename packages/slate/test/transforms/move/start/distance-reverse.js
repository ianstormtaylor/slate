/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.move(editor, { edge: 'start', reverse: true, distance: 3 })
}

export const input = (
  <editor>
    <block>
      one <anchor />
      two t<focus />
      hree
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      o<anchor />
      ne two t<focus />
      hree
    </block>
  </editor>
)
