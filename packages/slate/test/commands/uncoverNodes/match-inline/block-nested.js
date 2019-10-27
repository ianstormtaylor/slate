/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.uncoverNodes({ match: { key: 'a' } })
}

export const input = (
  <value>
    <block>
      <block>
        w<anchor />
        <inline key="a">
          or<focus />
        </inline>
        d
      </block>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <block>
        w<anchor />or<focus />d
      </block>
    </block>
  </value>
)
