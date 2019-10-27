/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.uncoverNodes({ match: { key: 'a' } })
}

export const input = (
  <value>
    <block>
      w<anchor />o
      <inline key="a">rd</inline>
      <text />
    </block>
    <block>
      <text />
      <inline key="a">an</inline>
      ot<focus />her
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      w<anchor />ord
    </block>
    <block>
      anot<focus />her
    </block>
  </value>
)
