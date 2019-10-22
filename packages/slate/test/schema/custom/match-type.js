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
      <block>invalid</block>
    </document>
  </value>
)

export const output = (
  <value>
    <document />
  </value>
)
