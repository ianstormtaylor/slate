/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.unwrapNodes({ match: { key: 'a' } })
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
