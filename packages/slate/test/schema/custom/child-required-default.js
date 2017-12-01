/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {},
    quote: {
      nodes: [
        { types: ['paragraph'], min: 1 },
      ]
    }
  }
}

export const input = (
  <value>
    <document>
      <quote />
    </document>
  </value>
)

export const output = (
  <value>
    <document />
  </value>
)
