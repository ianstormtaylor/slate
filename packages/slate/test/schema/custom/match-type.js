/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  rules: [
    {
      match: [{ type: 'paragraph' }],
      object: 'inline',
    },
  ],
}

export const input = (
  <value>
    <document>
      <paragraph>invalid</paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document />
  </value>
)
