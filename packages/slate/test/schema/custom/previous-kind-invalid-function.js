/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    image: {
      previous: [{ object: o => o === 'text' }],
    },
  },
}

export const input = (
  <value>
    <document>
      <paragraph>
        <quote />
        <image />
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
