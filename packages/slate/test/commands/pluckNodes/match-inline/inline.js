/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.pluckNodes({ match: { key: 'a' } })
}

export const input = (
  <value>
    <block>
      w<anchor />
      <inline key="a">
        or<focus />
      </inline>
      d
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      w<anchor />or<focus />d
    </block>
  </value>
)
