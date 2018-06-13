/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {},
    quote: {
      nodes: [{ types: ['paragraph'] }],
    },
  },
}

export const input = (
  <value>
    <document>
      <quote>
        <image />
      </quote>
    </document>
  </value>
)

export const output = (
  <value>
    <document />
  </value>
)
