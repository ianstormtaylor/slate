/** @jsx jsx */

import { jsx } from '../../helpers'

export const input = (
  <value>
    <block>one</block>
  </value>
)

export const run = editor => {
  return editor.getAfter({ path: [0, 0], offset: 1 })
}

export const output = { path: [0, 0], offset: 2 }
