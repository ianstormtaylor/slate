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
  <state>
    <document>
      <quote />
    </document>
  </state>
)

export const output = (
  <state>
    <document />
  </state>
)
