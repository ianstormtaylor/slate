/** @jsx jsx */

import { jsx } from '../../../helpers'

export const input = <value />

export const run = editor => {
  editor.insertNodes(<block>one</block>)
}

export const output = (
  <value>
    <block>
      one<cursor />
    </block>
  </value>
)

export const skip = true
