/** @jsx h */

import { h } from '../../../../helpers'

export const run = editor => {
  editor.delete()
}

export const input = (
  <value>
    <block>
      one<cursor />
    </block>
    <block>
      two<inline>three</inline>four
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      one<cursor />two<inline>three</inline>four
    </block>
  </value>
)
