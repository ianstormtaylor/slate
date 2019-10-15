/** @jsx h */

import { h } from '../../../helpers'

export const input = (
  <value>
    <block>
      w<annotation key="a">or</annotation>d
    </block>
  </value>
)

export const run = editor => {
  editor.insertTextAtPath([0, 0], 4, 'x')
}

export const output = (
  <value>
    <block>
      w<annotation key="a">or</annotation>dx
    </block>
  </value>
)
