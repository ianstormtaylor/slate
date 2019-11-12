/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.move({ reverse: true })
}

export const input = (
  <value>
    <block>
      one <cursor />two three
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      one<cursor /> two three
    </block>
  </value>
)
