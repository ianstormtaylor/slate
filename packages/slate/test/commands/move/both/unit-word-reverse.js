/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.move({ reverse: true, unit: 'word' })
}

export const input = (
  <value>
    <block>
      one tw
      <cursor />o three
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      one <cursor />
      two three
    </block>
  </value>
)
