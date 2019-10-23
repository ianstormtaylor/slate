/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.delete({ unit: 'character' })
}

export const input = (
  <value>
    <block>
      wor<cursor />d
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      wor<cursor />
    </block>
  </value>
)
