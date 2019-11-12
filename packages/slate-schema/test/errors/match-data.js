/** @jsx jsx */

import { jsx } from '../../helpers'

export const schema = {
  rules: [
    {
      match: [{ object: 'block', data: { thing: 'value' } }],
      type: 'quote',
    },
  ],
}

export const input = (
  <value>
    <document>
      <paragraph thing="value">
        <text />
      </block>
    </document>
  </value>
)

export const output = (
  <value>
    <document />
  </value>
)
