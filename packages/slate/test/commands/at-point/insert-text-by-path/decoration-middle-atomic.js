/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.insertTextAtPath([0, 0], 2, 'x')
}

export const options = {
  preserveDecorations: true,
}

export const input = (
  <value>
    <block>
      <text>
        w<result>or</result>d
      </text>
    </block>
  </value>
)

export const output = (
  <value>
    <block>woxrd</block>
  </value>
)
