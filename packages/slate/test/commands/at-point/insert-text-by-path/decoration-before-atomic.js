/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.insertTextAtPath([0, 0], 1, 'x')
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
    <block>
      wx<result>or</result>d
    </block>
  </value>
)
