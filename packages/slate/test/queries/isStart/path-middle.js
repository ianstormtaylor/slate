/** @jsx jsx */

import { jsx } from '../../helpers'

export const input = (
  <value>
    <block>
      on
      <cursor />e
    </block>
  </value>
)

export const run = editor => {
  const { anchor } = editor.value.selection
  return editor.isStart(anchor, [0])
}

export const output = false
