/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.addMarks([{ key: 'a' }])
  editor.removeMarks([{ key: 'a' }])
  editor.insertText('a')
}

export const input = (
  <value>
    <block>
      <cursor />
      word
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      a<cursor />
      word
    </block>
  </value>
)
