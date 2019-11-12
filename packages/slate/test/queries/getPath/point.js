/** @jsx jsx */

import { jsx } from '../../helpers'

export const input = (
  <value>
    <block>one</block>
  </value>
)

export const run = editor => {
  return editor.getPath({ path: [0, 0], offset: 1 })
}

export const output = [0, 0]
