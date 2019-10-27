/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.uncoverNodes({ match: { key: 'a' } })
}

export const input = (
  <value>
    <block key="a">
      <block>
        wo<anchor />rd
      </block>
      <block>
        an<focus />other
      </block>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      wo<anchor />rd
    </block>
    <block>
      an<focus />other
    </block>
  </value>
)
