/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.insertInline('emoji')
}

export const input = (
  <value>
    <block>
      <cursor />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <inline void>
        <cursor />
      </inline>
    </block>
  </value>
)
