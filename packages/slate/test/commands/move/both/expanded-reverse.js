/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.move({ reverse: true })
}

export const input = (
  <value>
    <block>
      one <anchor />
      two th
      <focus />
      ree
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      one
      <anchor /> two t<focus />
      hree
    </block>
  </value>
)
