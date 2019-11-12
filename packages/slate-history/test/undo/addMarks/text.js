/** @jsx jsx */

import { jsx } from '../../helpers'

export const run = editor => {
  editor.addMarks([{ key: 'a' }])
  editor.flush()
  editor.undo()
}

export const input = (
  <value>
    <block>
      <anchor />wo<focus />rd
    </block>
  </value>
)

export const output = input
