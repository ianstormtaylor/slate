/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.insertInline('emoji')
}

export const input = (
  <value>
    <block>
      word<cursor />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      word<inline void>
        <cursor />
      </inline>
    </block>
  </value>
)
