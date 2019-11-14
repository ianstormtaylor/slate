/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.setNodes({ key: true }, { match: 'block' })
}

export const input = (
  <value>
    <block void>
      <cursor />
      word
    </block>
  </value>
)

export const output = (
  <value>
    <block void key>
      <cursor />
      word
    </block>
  </value>
)
