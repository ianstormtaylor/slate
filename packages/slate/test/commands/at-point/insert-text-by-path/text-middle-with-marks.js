/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.insertTextAtPath([0, 0], 2, 'x', [{ type: 'bold' }])
}

export const input = (
  <value>
    <block>
      <text>
        wor<cursor />d
      </text>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      wo<b>x</b>r<cursor />d
    </block>
  </value>
)
