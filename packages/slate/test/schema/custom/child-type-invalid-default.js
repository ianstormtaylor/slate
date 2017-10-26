/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {},
    quote: {
      nodes: [
        { types: ['paragraph'] },
      ]
    }
  }
}

export const input = (
  <state>
    <document>
      <quote>
        <image />
      </quote>
    </document>
  </state>
)

export const output = (
  <state>
    <document />
  </state>
)
