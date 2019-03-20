/** @jsx h */

import h from '../../helpers/h'

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
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document />
  </value>
)
