/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {
      type: 'impossible',
    },
  },
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
