/** @jsx jsx */

import { jsx } from '../../../helpers'

export const input = (
  <value>
    <block>
      <cursor />
      word
    </block>
  </value>
)

export const run = editor => {
  editor.insertNodes(
    <inline>
      <text />
    </inline>,
    { at: [0, 0] }
  )
}

export const output = (
  <value>
    <block>
      <text />
      <inline>
        <text />
      </inline>
      <cursor />
      word
    </block>
  </value>
)
