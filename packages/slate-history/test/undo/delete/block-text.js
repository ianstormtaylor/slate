/** @jsx jsx */

import { jsx } from '../../helpers'

export const run = editor => {
  editor.delete()
}

export const input = (
  <value>
    <block>
      wo
      <cursor />
      rd
    </block>
  </value>
)

export const output = input

export const skip = true
