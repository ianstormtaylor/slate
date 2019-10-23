/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.delete({ unit: 'character', distance: 3, reverse: true })
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
      w<cursor />
    </block>
  </value>
)
