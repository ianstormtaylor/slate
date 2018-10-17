/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  rules: [
    {
      match: [{ object: 'block' }],
      data: {
        thing: v => v == 'value',
      },
    },
  ],
}

export const input = (
  <value>
    <document>
      <paragraph>
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
