/** @jsx h */

import { h } from '../../helpers'

export const input = (
  <value>
    <block>one</block>
  </value>
)

export const run = editor => {
  return editor.getRange({
    anchor: { path: [0, 0], offset: 2 },
    focus: { path: [0, 0], offset: 1 },
  })
}

export const output = {
  anchor: { path: [0, 0], offset: 2 },
  focus: { path: [0, 0], offset: 1 },
}
