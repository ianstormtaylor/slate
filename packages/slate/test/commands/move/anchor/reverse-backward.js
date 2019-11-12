/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.move({ edge: 'anchor', reverse: true })
}

export const input = (
  <value>
    <block>
      one <focus />two th<anchor />ree
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      one <focus />two t<anchor />hree
    </block>
  </value>
)
