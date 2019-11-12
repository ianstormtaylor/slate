/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.unwrapNodes({ match: { key: 'a' } })
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
