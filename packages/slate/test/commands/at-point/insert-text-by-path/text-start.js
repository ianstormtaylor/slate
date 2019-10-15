/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.insertTextAtPath([0, 0], 0, 'a')
}

export const input = (
  <value>
    <block>
      <text>
        wo<cursor />rd
      </text>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      awo<cursor />rd
    </block>
  </value>
)
