/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.delete()
}

export const input = (
  <value>
    <block void>
      <cursor />
    </block>
  </value>
)

export const output = <value />
