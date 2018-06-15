/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {
      isVoid: false,
    },
  },
}

export const input = (
  <value>
    <document>
      <block type="paragraph" isVoid />
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph />
    </document>
  </value>
)
