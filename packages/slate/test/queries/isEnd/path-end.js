/** @jsx jsx */

import { jsx } from '../../helpers'

export const input = (
  <value>
    <block>
      one<cursor />
    </block>
  </value>
)

export const run = editor => {
  const { anchor } = editor.value.selection
  return editor.isEnd(anchor, [0])
}

export const output = true
