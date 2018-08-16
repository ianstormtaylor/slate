/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {
      text: t => t === 'valid',
    },
  },
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
