/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {
      next: [{ type: t => t === 'paragraph' }],
    },
  },
}

export const input = (
  <value>
    <document>
      <paragraph />
      <image />
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
