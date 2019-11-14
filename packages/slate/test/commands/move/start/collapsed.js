/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.move({ edge: 'start' })
}

export const input = (
  <value>
    <block>
      one two t<cursor />
      hree
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      one two t<focus />h<anchor />
      ree
    </block>
  </value>
)
