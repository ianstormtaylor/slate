/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.removeTextAtPath([0, 0], 3, 1)
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
      w<result>or</result>
    </block>
  </value>
)
