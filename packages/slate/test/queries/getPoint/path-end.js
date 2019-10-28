/** @jsx h */

import { h } from '../../helpers'

export const input = (
  <value>
    <block>one</block>
  </value>
)

export const run = editor => {
  return editor.getPoint([0], { edge: 'end' })
}

export const output = { path: [0, 0], offset: 3 }
