/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {
      previous: [{ type: t => t === 'paragraph' }],
    },
  },
}

export const input = (
  <value>
    <document>
      <image />
      <paragraph />
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
