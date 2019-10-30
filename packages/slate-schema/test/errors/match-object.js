/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  rules: [
    {
      match: [{ object: 'block' }],
      data: {
        thing: v => v === 'value',
      },
    },
  ],
}

export const input = (
  <value>
    <document>
      <block>
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
