/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.insertTextAtPoint({ path: [0, 0], offset: 0 }, 'a')
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
