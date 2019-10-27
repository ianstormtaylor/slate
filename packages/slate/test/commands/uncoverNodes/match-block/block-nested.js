/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.uncoverNodes({ match: { key: 'a' } })
}

export const input = (
  <value>
    <block key="a">
      <block>
        <block>
          <cursor />word
        </block>
      </block>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <block>
        <cursor />word
      </block>
    </block>
  </value>
)
