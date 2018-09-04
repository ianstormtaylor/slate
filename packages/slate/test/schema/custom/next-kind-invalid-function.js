/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    image: {
      next: [{ object: o => o === 'text' }],
    },
  },
}

export const input = (
  <value>
    <document>
      <paragraph>
        <image />
        <quote />
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <image />
      </paragraph>
    </document>
  </value>
)
